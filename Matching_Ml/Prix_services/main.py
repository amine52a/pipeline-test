
"""
main.py  –  Entraînement + API FastAPI
Modèles : random_forest | xgboost | linear
Lancer : uvicorn main:app --reload
"""
import os
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from contextlib import asynccontextmanager

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import py_eureka_client.eureka_client as eureka_client

# ── Config ────────────────────────────────────────────────────────────────────
MODEL_NAMES = ["random_forest", "xgboost", "linear"]
MODEL_DIR = Path("artifacts")
CSV_PATH  = Path("artifacts/contracts.csv")
FEATURES = ["total_hours", "total_paid", "project_duration_days"]

# ── Entraînement ──────────────────────────────────────────────────────────────
def train_models():
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip().str.lower()

    # Reconstruire hourly_rate quand manquant
    df["hourly_rate"] = df["hourly_rate"].fillna(
        df["total_paid"] / df["total_hours"].replace(0, np.nan)
    )

    # Garder uniquement les lignes exploitables
    df_model = df[FEATURES + ["hourly_rate"]].dropna()
    df_model = df_model[df_model["total_hours"] > 0]
    df_model = df_model[df_model["total_paid"] > 0]
    df_model = df_model[df_model["hourly_rate"] > 0]
    df_model = df_model[df_model["hourly_rate"] < 500]  # filtre outliers

    print(f"📊 Lignes après nettoyage : {len(df_model)}")
    print(f"📊 hourly_rate — min: {df_model['hourly_rate'].min():.2f} | "
          f"max: {df_model['hourly_rate'].max():.2f} | "
          f"médiane: {df_model['hourly_rate'].median():.2f}\n")

    if len(df_model) < 50:
        raise ValueError(
            f"❌ Trop peu de données ({len(df_model)} lignes valides)."
        )

    X = df_model[FEATURES]
    y = df_model["hourly_rate"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Train : {len(X_train)} lignes | Test : {len(X_test)} lignes\n")

    models = {
        "random_forest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "xgboost":       XGBRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "linear":        LinearRegression(),
    }

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        rmse   = np.sqrt(mean_squared_error(y_test, y_pred))
        r2     = r2_score(y_test, y_pred)
        print(f"[{name}]  RMSE : {rmse:.2f}  |  R² : {r2:.4f}")
        joblib.dump(model, MODEL_DIR / f"{name}.pkl")
        print(f"  ✅ Sauvegardé → artifacts/prix/{name}.pkl\n")

# ── Chargement des modèles au démarrage ───────────────────────────────────────
ml = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    missing = [n for n in MODEL_NAMES if not (MODEL_DIR / f"{n}.pkl").exists()]
    if missing:
        print("🔄 Modèles manquants, entraînement en cours...")
        train_models()

    for name in MODEL_NAMES:
        ml[name] = joblib.load(MODEL_DIR / f"{name}.pkl")
        print(f"✅ {name} chargé")

    # Register with Eureka
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="ml-prix-service",
        instance_port=8002,
        instance_host="localhost",
        health_check_url="http://localhost:8002/health",
        status_page_url="http://localhost:8002/health",
    )
    print("✅ Registered with Eureka as ml-prix-service")

    yield

    await eureka_client.stop_async()
    ml.clear()

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Prix ML API",
    description="Estimation du taux horaire optimal — RF / XGBoost / Linear",
    version="2.2.0",
    lifespan=lifespan,
)

# ── Schémas Pydantic ──────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    total_hours: float = Field(..., gt=0, example=120.0)
    total_paid: float = Field(..., gt=0, example=5000.0)
    project_duration_days: int = Field(..., gt=0, example=30)

    model: str = "random_forest"

class PredictResponse(BaseModel):
    hourly_rate: float
    currency:    str = "USD"

# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health():
    return {"status": "UP"}

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Prix ML API 🚀 — docs : /docs",
        "available_models": MODEL_NAMES,
    }

@app.get("/models", tags=["Info"])
def list_models():
    return {"available_models": MODEL_NAMES}

@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict(payload: PredictRequest):
    """Prédit le taux horaire optimal avec le modèle choisi."""
    if payload.model not in ml:
        raise HTTPException(
            status_code=400,
            detail=f"Modèle inconnu : '{payload.model}'. Choix valides : {MODEL_NAMES}",
        )
    try:
        X    = pd.DataFrame([payload.model_dump()])[FEATURES]
        pred = ml[payload.model].predict(X)[0]
        return PredictResponse(hourly_rate=round(float(pred), 2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/prix-optimal/{job_title}", tags=["Analytics"])
def prix_optimal(job_title: str):
    """Taux horaire médian pour un job title (depuis contracts.csv)."""
    if not CSV_PATH.exists():
        raise HTTPException(status_code=404, detail="contracts.csv introuvable")
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip().str.lower()
    data = df[df["job_title"] == job_title]
    if data.empty:
        raise HTTPException(status_code=404, detail=f"Job introuvable : {job_title}")
    return {
        "job_title":          job_title,
        "median_hourly_rate": round(data["hourly_rate"].median(), 2),
        "sample_count":       int(len(data)),
        "currency":           "USD",
    }