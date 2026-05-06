# 🤖 ML Prediction Service

Machine Learning microservice for project feasibility prediction in the Matchy platform.

## 📋 Features

- **Project Success Prediction**: Predict if a project will succeed or fail
- **Batch Predictions**: Predict multiple projects at once
- **Risk Assessment**: Automatic risk level calculation
- **Confidence Scoring**: Provides confidence levels for predictions
- **RESTful API**: Easy integration with Postman and frontend
- **Eureka Integration**: Registers with service discovery

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd services/ml-prediction-service
pip install -r requirements.txt
```

### 2. Prepare Dataset

Place your `project_feasibility_dataset.csv` in this directory.

### 3. Train the Model

```bash
python train_model.py
```

This will:
- Load and clean the dataset
- Train multiple ML models (Random Forest, XGBoost)
- Select the best model
- Save the model to `models/` directory

### 4. Start the Service

```bash
python app.py
```

The service will start on port **8085** and register with Eureka.

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Get Model Information
```
GET /api/ml/model-info
```

Response:
```json
{
  "model_name": "XGBoost",
  "f1_score": 0.9234,
  "accuracy": 0.9156,
  "auc": 0.9567,
  "features": ["budget", "team_size", ...],
  "total_features": 15
}
```

### Single Prediction
```
POST /api/ml/predict
Content-Type: application/json

{
  "budget": 50000,
  "team_size": 5,
  "duration_months": 6,
  "complexity": "medium",
  "client_experience": "high"
}
```

Response:
```json
{
  "success": true,
  "prediction": {
    "will_succeed": true,
    "success_probability": 87.5,
    "failure_probability": 12.5,
    "confidence_level": "Very High",
    "risk_level": "LOW"
  },
  "recommendation": "✅ Highly recommended to proceed...",
  "input_features": {...}
}
```

### Batch Prediction
```
POST /api/ml/batch-predict
Content-Type: application/json

{
  "projects": [
    {"budget": 50000, "team_size": 5, ...},
    {"budget": 30000, "team_size": 3, ...}
  ]
}
```

### Get Required Features
```
GET /api/ml/features
```

## 🧪 Testing with Postman

### 1. Import Collection

Create a new Postman collection with these requests:

**Health Check**
- Method: GET
- URL: `http://localhost:8085/health`

**Model Info**
- Method: GET
- URL: `http://localhost:8085/api/ml/model-info`

**Predict Project**
- Method: POST
- URL: `http://localhost:8085/api/ml/predict`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "budget": 50000,
  "team_size": 5,
  "duration_months": 6
}
```

### 2. Test Through API Gateway

Once registered with Eureka, you can also access through the API Gateway:

```
http://localhost:8091/ml-prediction-service/api/ml/predict
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Angular Frontend (Port 4200)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     API Gateway (Port 8091)             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ML Prediction Service (Port 8085)      │
│  - Flask API                            │
│  - XGBoost/Random Forest Model          │
│  - SMOTE Balancing                      │
│  - Feature Scaling                      │
└─────────────────────────────────────────┘
```

## 📊 Model Details

- **Algorithm**: XGBoost or Random Forest (best performer selected)
- **Features**: Budget, team size, duration, complexity, etc.
- **Balancing**: SMOTE for handling imbalanced classes
- **Scaling**: StandardScaler for feature normalization
- **Metrics**: F1 Score, Accuracy, AUC-ROC

## 🔧 Configuration

Edit `.env` file:

```env
PORT=8085
EUREKA_SERVER=http://localhost:8761/eureka
```

## 📝 Notes

- The service is completely isolated and won't affect other microservices
- Model files are stored in `models/` directory
- Supports both single and batch predictions
- Automatic risk assessment and recommendations
- Full CORS support for frontend integration

## 🐛 Troubleshooting

**Model not loaded error:**
```bash
python train_model.py
```

**Port already in use:**
Change PORT in `.env` file

**Eureka registration failed:**
Ensure Eureka server is running on port 8761

## 📦 Dependencies

- Flask: Web framework
- scikit-learn: ML algorithms
- XGBoost: Gradient boosting
- pandas/numpy: Data processing
- imbalanced-learn: SMOTE balancing
- py-eureka-client: Service discovery
