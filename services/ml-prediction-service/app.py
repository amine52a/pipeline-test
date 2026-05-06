"""
ML Prediction Service - Flask API
Provides project feasibility predictions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
import time
import py_eureka_client.eureka_client as eureka_client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Metrics counters
_start_time = time.time()
_prediction_count = 0
_error_count = 0

# Configuration
PORT = int(os.getenv('PORT', 8085))
EUREKA_SERVER = os.getenv('EUREKA_SERVER', 'http://localhost:8761/eureka')

# Load model and artifacts
print("🔄 Loading ML model and artifacts...")
try:
    model = joblib.load('models/best_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    label_encoders = joblib.load('models/label_encoders.pkl')
    feature_names = joblib.load('models/feature_names.pkl')
    metadata = joblib.load('models/metadata.pkl')
    print("✅ Model loaded successfully!")
    print(f"   Model: {metadata['model_name']}")
    print(f"   F1 Score: {metadata['f1_score']:.4f}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("⚠️  Please run 'python train_model.py' first!")
    model = None

# Register with Eureka
try:
    eureka_client.init(
        eureka_server=EUREKA_SERVER,
        app_name="ml-prediction-service",
        instance_port=PORT,
        instance_host="localhost"
    )
    print(f"✅ Registered with Eureka at {EUREKA_SERVER}")
except Exception as e:
    print(f"⚠️  Eureka registration failed: {e}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ml-prediction-service',
        'model_loaded': model is not None
    }), 200


@app.route('/metrics', methods=['GET'])
def metrics():
    """Prometheus metrics endpoint"""
    import time
    uptime = time.time() - _start_time
    output = "\n".join([
        '# HELP process_uptime_seconds ML service uptime',
        '# TYPE process_uptime_seconds gauge',
        f'process_uptime_seconds {uptime:.2f}',
        '',
        '# HELP ml_model_loaded Whether the ML model is loaded',
        '# TYPE ml_model_loaded gauge',
        f'ml_model_loaded {1 if model is not None else 0}',
        '',
        '# HELP ml_predictions_total Total predictions made',
        '# TYPE ml_predictions_total counter',
        f'ml_predictions_total{{service="ml-prediction-service"}} {_prediction_count}',
        '',
        '# HELP ml_prediction_errors_total Total prediction errors',
        '# TYPE ml_prediction_errors_total counter',
        f'ml_prediction_errors_total{{service="ml-prediction-service"}} {_error_count}',
        '',
        '# HELP ml_model_f1_score Model F1 score from training',
        '# TYPE ml_model_f1_score gauge',
        f'ml_model_f1_score {metadata["f1_score"] if model else 0}',
    ])
    return output, 200, {'Content-Type': 'text/plain; version=0.0.4'}

@app.route('/api/ml/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_name': metadata['model_name'],
        'f1_score': float(metadata['f1_score']),
        'accuracy': float(metadata['accuracy']),
        'auc': float(metadata['auc']),
        'features': metadata['features'],
        'total_features': len(metadata['features'])
    }), 200

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    """
    Predict project feasibility
    
    Expected JSON body:
    {
        "budget": 50000,
        "team_size": 5,
        "duration_months": 6,
        ... (other features)
    }
    """
    if model is None:
        return jsonify({'error': 'Model not loaded. Please train the model first.'}), 500
    
    try:
        # Get input data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Convert to DataFrame
        df_new = pd.DataFrame([data])
        
        # Handle missing columns (set to 0 or default)
        for col in feature_names:
            if col not in df_new.columns:
                df_new[col] = 0
        
        # Encode categorical variables
        for col, le in label_encoders.items():
            if col in df_new.columns:
                try:
                    df_new[col] = le.transform(df_new[col])
                except ValueError:
                    # Unknown category, use most frequent (0)
                    df_new[col] = 0
        
        # Ensure correct column order
        df_new = df_new[feature_names]
        
        # Scale features
        X_new = scaler.transform(df_new)
        
        # Make prediction
        prediction = int(model.predict(X_new)[0])
        probability = float(model.predict_proba(X_new)[0][1])
        
        # Determine confidence level
        if probability >= 0.8:
            confidence = "Very High"
            risk_level = "LOW"
        elif probability >= 0.6:
            confidence = "High"
            risk_level = "LOW"
        elif probability >= 0.4:
            confidence = "Medium"
            risk_level = "MEDIUM"
        else:
            confidence = "Low"
            risk_level = "HIGH"
        
        # Prepare response
        result = {
            'success': True,
            'prediction': {
                'will_succeed': bool(prediction == 1),
                'success_probability': round(probability * 100, 2),
                'failure_probability': round((1 - probability) * 100, 2),
                'confidence_level': confidence,
                'risk_level': risk_level
            },
            'recommendation': get_recommendation(probability),
            'input_features': data
        }

        global _prediction_count
        _prediction_count += 1
        return jsonify(result), 200

    except Exception as e:
        global _error_count
        _error_count += 1
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ml/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict multiple projects at once
    
    Expected JSON body:
    {
        "projects": [
            {"budget": 50000, "team_size": 5, ...},
            {"budget": 30000, "team_size": 3, ...}
        ]
    }
    """
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        projects = data.get('projects', [])
        
        if not projects:
            return jsonify({'error': 'No projects provided'}), 400
        
        results = []
        for idx, project in enumerate(projects):
            try:
                # Convert to DataFrame
                df_new = pd.DataFrame([project])
                
                # Handle missing columns
                for col in feature_names:
                    if col not in df_new.columns:
                        df_new[col] = 0
                
                # Encode categorical variables
                for col, le in label_encoders.items():
                    if col in df_new.columns:
                        try:
                            df_new[col] = le.transform(df_new[col])
                        except ValueError:
                            df_new[col] = 0
                
                # Ensure correct column order
                df_new = df_new[feature_names]
                
                # Scale and predict
                X_new = scaler.transform(df_new)
                prediction = int(model.predict(X_new)[0])
                probability = float(model.predict_proba(X_new)[0][1])
                
                results.append({
                    'project_index': idx,
                    'will_succeed': bool(prediction == 1),
                    'success_probability': round(probability * 100, 2),
                    'risk_level': 'LOW' if probability > 0.6 else 'MEDIUM' if probability > 0.4 else 'HIGH'
                })
            except Exception as e:
                results.append({
                    'project_index': idx,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'total_projects': len(projects),
            'predictions': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_recommendation(probability):
    """Generate recommendation based on probability"""
    if probability >= 0.8:
        return "✅ Highly recommended to proceed. Project shows strong indicators of success."
    elif probability >= 0.6:
        return "✅ Recommended to proceed with standard monitoring."
    elif probability >= 0.4:
        return "⚠️ Proceed with caution. Consider risk mitigation strategies."
    else:
        return "❌ Not recommended. High risk of failure. Review project parameters."

@app.route('/api/ml/features', methods=['GET'])
def get_features():
    """Get list of required features for prediction"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'features': feature_names,
        'total': len(feature_names)
    }), 200

if __name__ == '__main__':
    print("="*60)
    print("🚀 ML PREDICTION SERVICE")
    print("="*60)
    print(f"   Port: {PORT}")
    print(f"   Eureka: {EUREKA_SERVER}")
    print("="*60)
    app.run(host='0.0.0.0', port=PORT, debug=False)
