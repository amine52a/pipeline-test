import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity
import py_eureka_client.eureka_client as eureka_client
import asyncio

app = FastAPI()

import os

BASE_PATH = os.path.join(os.path.dirname(__file__), "artifacts", "matching")

tfidf = joblib.load(os.path.join(BASE_PATH, "tfidf_vectorizer.pkl"))
tfidf_freelancers = joblib.load(os.path.join(BASE_PATH, "tfidf_freelancers.pkl"))

freelancers = pd.read_csv(os.path.join(BASE_PATH, "freelancers.csv"))


@app.on_event("startup")
async def startup_event():
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="ml-matching-service",
        instance_port=8001,
        instance_host="localhost",
        health_check_url="http://localhost:8001/health",
        status_page_url="http://localhost:8001/health",
    )
    print("✅ Registered with Eureka as ml-matching-service")


@app.on_event("shutdown")
async def shutdown_event():
    await eureka_client.stop_async()


@app.get("/health")
def health():
    return {"status": "UP", "service": "ml-matching-service"}

tfidf = joblib.load(os.path.join(BASE_PATH, "tfidf_vectorizer.pkl"))
tfidf_freelancers = joblib.load(os.path.join(BASE_PATH, "tfidf_freelancers.pkl"))

freelancers = pd.read_csv(os.path.join(BASE_PATH, "freelancers.csv"))



@app.post("/matching")
def matching(data: dict):
    try:
        # 1. récupérer description
        text = data.get("description", "")

        if not text:
            return {"error": "description is empty"}

        # 2. transformer texte projet
        project_vec = tfidf.transform([text])

        # 3. calcul similarité
        scores = cosine_similarity(project_vec, tfidf_freelancers)[0]

        # 4. top indices
        top_idx = scores.argsort()[::-1]

        results = []
        seen = set()

        # 5. construire résultat
        for idx in top_idx:
            profile = freelancers.iloc[idx]["profile"]

            # éviter doublons
            if profile in seen:
                continue

            seen.add(profile)

            results.append({
                "person_id": int(freelancers.iloc[idx]["person_id"]),
                "profile": str(profile),
                "score": round(float(scores[idx]), 4)
            })

            # stop après 5 résultats
            if len(results) == 5:
                break

        return {"results": results}

    except Exception as e:
        return {"error": str(e)}