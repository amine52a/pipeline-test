"""
ML Prediction Service - FastAPI
Provides project feasibility predictions
"""
import joblib
import json
import os
import time
import numpy as np
import pandas as pd
from typing import Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import py_eureka_client.eureka_client as eureka_client

load_dotenv()

# =========================
# ⚙️ CONFIG
# =========================
PORT = int(os.getenv("PORT", 8085))
BASE_DIR = os.path.dirname(__file__)
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

# =========================
# 🚀 APP
# =========================
app = FastAPI(
    title="ML Feasibility Prediction Service",
    description="Predicts project success probability using a trained ML model.",
    version="1.0.0",
)


@app.on_event("startup")
async def startup_event():
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="ml-feasibility-service",
        instance_port=8004,
        instance_host="localhost",
        health_check_url="http://localhost:8004/health",
        status_page_url="http://localhost:8004/health",
    )
    print("✅ Registered with Eureka as ml-feasibility-service")


@app.on_event("shutdown")
async def shutdown_event():
    await eureka_client.stop_async()

# =========================
# 📦 LOAD ARTIFACTS
# =========================
_start_time = time.time()
_prediction_count = 0
_error_count = 0

print("🔄 Loading ML model and artifacts...")
try:
    model = joblib.load(os.path.join(ARTIFACTS_DIR, "best_model.pkl"))
    scaler = joblib.load(os.path.join(ARTIFACTS_DIR, "scaler.pkl"))
    label_encoders = joblib.load(os.path.join(ARTIFACTS_DIR, "label_encoders.pkl"))

    with open(os.path.join(ARTIFACTS_DIR, "model_metadata.json")) as f:
        metadata = json.load(f)

    feature_names: list[str] = metadata["feature_names"]
    categorical_columns: list[str] = metadata["categorical_columns"]

    print("✅ Model loaded successfully!")
    print(f"   Model   : {metadata['best_model_name']}")
    print(f"   F1 Score: {metadata['metrics']['f1_score']:.4f}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    metadata = {}
    feature_names = []
    categorical_columns = []

# =========================
# 📐 SCHEMAS
# =========================
class ProjectInput(BaseModel):
    budget: float
    team_size: int
    duration_months: int
    industry: str
    project_type: str
    client_experience: str
    team_experience_years: float
    previous_projects: int
    technology_stack: str
    risk_score: float

    model_config = {
        "json_schema_extra": {
            "example": {
                "budget": 75000,
                "team_size": 6,
                "duration_months": 8,
                "industry": "Technology",
                "project_type": "Web Development",
                "client_experience": "Experienced",
                "team_experience_years": 4.5,
                "previous_projects": 12,
                "technology_stack": "React/Node",
                "risk_score": 3.2
            }
        }
    }

class BatchInput(BaseModel):
    projects: list[ProjectInput]

    model_config = {
        "json_schema_extra": {
            "example": {
                "projects": [
                    {
                        "budget": 75000,
                        "team_size": 6,
                        "duration_months": 8,
                        "industry": "Technology",
                        "project_type": "Web Development",
                        "client_experience": "Experienced",
                        "team_experience_years": 4.5,
                        "previous_projects": 12,
                        "technology_stack": "React/Node",
                        "risk_score": 3.2
                    },
                    {
                        "budget": 10000,
                        "team_size": 2,
                        "duration_months": 2,
                        "industry": "Retail",
                        "project_type": "Mobile App",
                        "client_experience": "Beginner",
                        "team_experience_years": 0.5,
                        "previous_projects": 1,
                        "technology_stack": "Flutter",
                        "risk_score": 8.5
                    }
                ]
            }
        }
    }

class PredictionResult(BaseModel):
    will_succeed: bool
    label: str
    success_probability: float
    failure_probability: float
    confidence_level: str
    risk_level: str

class PredictionResponse(BaseModel):
    success: bool
    prediction: PredictionResult
    recommendation: str
    model_used: str
    input_features: dict[str, Any]

class BatchPredictionResponse(BaseModel):
    success: bool
    total_projects: int
    predictions: list[dict[str, Any]]

# =========================
# 🔧 HELPERS
# =========================
def preprocess_input(data: dict) -> np.ndarray:
    df = pd.DataFrame([data])

    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    for col in categorical_columns:
        if col in df.columns:
            le = label_encoders[col]
            try:
                df[col] = le.transform(df[col])
            except ValueError:
                df[col] = 0

    df = df[feature_names]
    return scaler.transform(df)

def get_confidence(prob: float) -> str:
    if prob >= 0.8: return "Very High"
    if prob >= 0.6: return "High"
    if prob >= 0.4: return "Medium"
    return "Low"

def get_risk_level(prob: float) -> str:
    if prob > 0.7: return "LOW"
    if prob > 0.4: return "MEDIUM"
    return "HIGH"

def get_recommendation(prob: float) -> str:
    if prob >= 0.8:
        return "✅ Highly recommended to proceed. Project shows strong indicators of success."
    if prob >= 0.6:
        return "✅ Recommended to proceed with standard monitoring."
    if prob >= 0.4:
        return "⚠️ Proceed with caution. Consider risk mitigation strategies."
    return "❌ Not recommended. High risk of failure. Review project parameters."

def check_model():
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please add artifacts first.")

# =========================
# 🏥 HEALTH & METRICS
# =========================
@app.get("/health", tags=["Monitoring"])
def health():
    return {
        "status": "healthy",
        "service": "ml-prediction-service",
        "model_loaded": model is not None,
    }

@app.get("/metrics", tags=["Monitoring"])
def metrics():
    uptime = time.time() - _start_time
    f1 = metadata.get("metrics", {}).get("f1_score", 0) if model else 0

    lines = [
        "# HELP process_uptime_seconds ML service uptime",
        "# TYPE process_uptime_seconds gauge",
        f"process_uptime_seconds {uptime:.2f}",
        "",
        "# HELP ml_model_loaded Whether the ML model is loaded",
        "# TYPE ml_model_loaded gauge",
        f"ml_model_loaded {1 if model is not None else 0}",
        "",
        "# HELP ml_predictions_total Total predictions made",
        "# TYPE ml_predictions_total counter",
        f'ml_predictions_total{{service="ml-prediction-service"}} {_prediction_count}',
        "",
        "# HELP ml_prediction_errors_total Total prediction errors",
        "# TYPE ml_prediction_errors_total counter",
        f'ml_prediction_errors_total{{service="ml-prediction-service"}} {_error_count}',
        "",
        "# HELP ml_model_f1_score Model F1 score from training",
        "# TYPE ml_model_f1_score gauge",
        f"ml_model_f1_score {f1}",
    ]
    return PlainTextResponse("\n".join(lines), media_type="text/plain; version=0.0.4")

# =========================
# 📊 MODEL INFO
# =========================
@app.get("/api/ml/model-info", tags=["Model"])
def model_info():
    check_model()
    return {
        "model_name": metadata["best_model_name"],
        "metrics": metadata["metrics"],
        "features": feature_names,
        "total_features": len(feature_names),
        "classes": metadata["classes"],
    }

@app.get("/api/ml/features", tags=["Model"])
def get_features():
    check_model()
    return {
        "features": feature_names,
        "categorical_features": categorical_columns,
        "total": len(feature_names),
    }

# =========================
# 🔍 PREDICT
# =========================
@app.post("/api/ml/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(payload: ProjectInput):
    global _prediction_count, _error_count
    check_model()

    try:
        data = payload.model_dump()
        X = preprocess_input(data)

        prediction = int(model.predict(X)[0])
        proba = model.predict_proba(X)[0]
        prob_success = float(proba[1])
        prob_failure = float(proba[0])

        _prediction_count += 1

        return PredictionResponse(
            success=True,
            prediction=PredictionResult(
                will_succeed=prediction == 1,
                label="Success" if prediction == 1 else "Failure",
                success_probability=round(prob_success * 100, 2),
                failure_probability=round(prob_failure * 100, 2),
                confidence_level=get_confidence(prob_success),
                risk_level=get_risk_level(prob_success),
            ),
            recommendation=get_recommendation(prob_success),
            model_used=metadata["best_model_name"],
            input_features=data,
        )
    except Exception as e:
        _error_count += 1
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# 📦 BATCH PREDICT
# =========================
@app.post("/api/ml/batch-predict", response_model=BatchPredictionResponse, tags=["Prediction"])
def batch_predict(payload: BatchInput):
    global _prediction_count, _error_count
    check_model()

    results = []
    for idx, project in enumerate(payload.projects):
        try:
            data = project.model_dump()
            X = preprocess_input(data)

            prediction = int(model.predict(X)[0])
            prob_success = float(model.predict_proba(X)[0][1])

            results.append({
                "project_index": idx,
                "will_succeed": prediction == 1,
                "label": "Success" if prediction == 1 else "Failure",
                "success_probability": round(prob_success * 100, 2),
                "confidence_level": get_confidence(prob_success),
                "risk_level": get_risk_level(prob_success),
            })
            _prediction_count += 1
        except Exception as e:
            _error_count += 1
            results.append({"project_index": idx, "error": str(e)})

    return BatchPredictionResponse(
        success=True,
        total_projects=len(payload.projects),
        predictions=results,
    )

# =========================
# 🏁 ENTRY POINT
# =========================
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🚀 ML PREDICTION SERVICE - Feasibility")
    print("=" * 60)
    print(f"   Port      : {PORT}")
    print(f"   Artifacts : {ARTIFACTS_DIR}")
    print(f"   Docs      : http://localhost:{PORT}/docs")
    print("=" * 60)
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=False)
