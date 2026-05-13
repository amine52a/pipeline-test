from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
import py_eureka_client.eureka_client as eureka_client

app = FastAPI(title="Freelancer Matching Platform API")


@app.on_event("startup")
async def startup_event():
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="ml-profil-service",
        instance_port=8003,
        instance_host="localhost",
        health_check_url="http://localhost:8003/health",
        status_page_url="http://localhost:8003/health",
    )
    print("✅ Registered with Eureka as ml-profil-service")


@app.on_event("shutdown")
async def shutdown_event():
    await eureka_client.stop_async()

# ---------------------------
# 📦 Charger les modèles
# ---------------------------
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "artifacts")

try:
    rf_model = joblib.load(os.path.join(MODELS_DIR, "random_forest.pkl"))
    km_model = joblib.load(os.path.join(MODELS_DIR, "kmeans.pkl"))
    scaler   = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
    encoders = joblib.load(os.path.join(MODELS_DIR, "label_encoders.pkl"))
    features = joblib.load(os.path.join(MODELS_DIR, "features.pkl"))
    print("✅ Modèles ML chargés avec succès")
except Exception as e:
    print(f"❌ Erreur chargement modèles : {e}")
    rf_model = km_model = scaler = encoders = features = None

# ---------------------------
# 📋 Schéma requête
# ---------------------------
class FreelancerProfile(BaseModel):
    years_experience          : float = Field(..., ge=0, le=50, example=5.0)
    skills_count              : int   = Field(..., ge=0, le=100, example=12)
    has_certifications        : int   = Field(..., ge=0, le=1, example=1)
    has_obsolete_skill        : int   = Field(..., ge=0, le=1, example=0)
    experience_level          : str   = Field(..., example="Mid-Level")
    industry                  : str   = Field(..., example="Technology")
    job_type                  : str   = Field(..., example="Remote")
    job_title                 : str   = Field(..., example="Data Scientist")
    profile_completeness_score: float = Field(..., ge=0, le=100, example=88.0)

# ---------------------------
# 🔧 Encodage
# ---------------------------
def encode_profile(profile: FreelancerProfile) -> np.ndarray:
    cat_cols = ['experience_level', 'industry', 'job_type', 'job_title']
    encoded  = {}

    for col in cat_cols:
        le  = encoders[col]
        val = getattr(profile, col)
        if val not in le.classes_:
            raise HTTPException(
                status_code=422,
                detail=f"Valeur inconnue pour '{col}': '{val}'. "
                       f"Valeurs acceptées : {list(le.classes_)}"
            )
        encoded[col + '_enc'] = int(le.transform([val])[0])

    input_dict = {
        'years_experience'    : profile.years_experience,
        'skills_count'        : profile.skills_count,
        'has_certifications'  : profile.has_certifications,
        'has_obsolete_skill'  : profile.has_obsolete_skill,
        'experience_level_enc': encoded['experience_level_enc'],
        'industry_enc'        : encoded['industry_enc'],
        'job_type_enc'        : encoded['job_type_enc'],
        'job_title_enc'       : encoded['job_title_enc'],
    }

    X        = np.array([[input_dict[f] for f in features]])
    X_scaled = scaler.transform(X)
    return X_scaled

# ---------------------------
# 🚀 ROUTES
# ---------------------------
@app.post("/predict/profile-optimization")
def predict_profile(profile: FreelancerProfile):
    if rf_model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")

    X_scaled   = encode_profile(profile)
    prediction = int(rf_model.predict(X_scaled)[0])
    proba      = rf_model.predict_proba(X_scaled)[0]

    return {
        "profile_optimized"  : prediction,
        "label"              : "Optimisé ✅" if prediction == 1 else "Non optimisé ❌",
        "confidence"         : round(float(proba[prediction]), 4),
        "proba_optimized"    : round(float(proba[1]), 4),
        "proba_not_optimized": round(float(proba[0]), 4),
    }


@app.post("/predict/cluster")
def predict_cluster(profile: FreelancerProfile):
    if km_model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")

    X_scaled = encode_profile(profile)
    cluster  = int(km_model.predict(X_scaled)[0])

    cluster_labels = {
        0: "Débutant généraliste",
        1: "Expert certifié",
        2: "Profil obsolète à renouveler",
        3: "Intermédiaire spécialisé",
    }

    return {
        "cluster"       : cluster,
        "cluster_label" : cluster_labels.get(cluster, f"Cluster {cluster}"),
        "recommendation": get_recommendation(cluster),
    }


def get_recommendation(cluster: int) -> str:
    recs = {
        0: "Ajoutez des certifications et augmentez votre nombre de compétences.",
        1: "Profil fort ! Mettez à jour régulièrement vos compétences.",
        2: "Supprimez les compétences obsolètes et ajoutez des technologies récentes.",
        3: "Complétez votre profil et visez des certifications pour passer au niveau supérieur.",
    }
    return recs.get(cluster, "Continuez à améliorer votre profil.")


@app.post("/predict/full-analysis")
def full_analysis(profile: FreelancerProfile):
    opt_result     = predict_profile(profile)
    cluster_result = predict_cluster(profile)

    return {
        "optimization": opt_result,
        "clustering"  : cluster_result,
        "summary"     : (
            f"Profil {opt_result['label']} "
            f"(confiance : {opt_result['confidence']*100:.1f}%) — "
            f"appartient au groupe : {cluster_result['cluster_label']}."
        ),
    }


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "ml-profil-service",
        "models_loaded": rf_model is not None and km_model is not None,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("asma:app", host="0.0.0.0", port=8001, reload=True)

print("🔥 PROFIL SERVICE ACTIVE")

@app.get("/debug")
def debug():
    return {"service": "PROFIL"}