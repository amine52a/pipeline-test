# -*- coding: utf-8 -*-
"""
ML Model Training Script for Project Feasibility Prediction
This script trains the model and saves it for use in the API
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from sklearn.metrics import f1_score, accuracy_score, roc_auc_score

print("="*60)
print("🚀 TRAINING PROJECT FEASIBILITY PREDICTION MODEL")
print("="*60)

# Create models directory
os.makedirs('models', exist_ok=True)

# Load data
print("\n📂 Loading dataset...")
df = pd.read_csv("project_feasibility_dataset.csv")
print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Clean data
print("\n🧹 Cleaning data...")
df_clean = df.copy()
df_clean = df_clean.drop(columns=['project_id', 'created_at'], errors='ignore')

# Fill missing values (pandas 3.x compatible)
for col in df_clean.columns:
    if df_clean[col].dtype == 'object' or str(df_clean[col].dtype) == 'string':
        df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0])
    elif pd.api.types.is_numeric_dtype(df_clean[col]):
        df_clean[col] = df_clean[col].fillna(df_clean[col].median())
    else:
        df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0])

print("✅ Data cleaned")

# Encoding
print("\n🔤 Encoding categorical variables...")
le_dict = {}
for col in df_clean.select_dtypes(include='object').columns:
    le = LabelEncoder()
    df_clean[col] = le.fit_transform(df_clean[col])
    le_dict[col] = le

print(f"✅ Encoded {len(le_dict)} categorical columns")

# Split features and target
X = df_clean.drop('project_success', axis=1)
y = df_clean['project_success']
feature_names = X.columns.tolist()

# Scaling
print("\n⚖️  Scaling features...")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print("✅ Features scaled")

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\n📊 Data split: {X_train.shape[0]} train, {X_test.shape[0]} test")

# Apply SMOTE
print("\n🔥 Applying SMOTE for class balancing...")
smote = SMOTE(random_state=42)
X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)
print(f"✅ Balanced: {X_train.shape[0]} → {X_train_bal.shape[0]} samples")

# Train models
print("\n🤖 Training models...")
models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "XGBoost": XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1,
                             eval_metric='logloss', random_state=42)
}

results = {}
for name, model in models.items():
    print(f"\n   Training {name}...")
    model.fit(X_train_bal, y_train_bal)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    results[name] = {
        "F1": f1_score(y_test, y_pred),
        "Accuracy": accuracy_score(y_test, y_pred),
        "AUC": roc_auc_score(y_test, y_prob)
    }
    print(f"   ✅ F1: {results[name]['F1']:.4f} | AUC: {results[name]['AUC']:.4f}")

# Select best model
best_model_name = max(results, key=lambda x: results[x]['F1'])
best_model = models[best_model_name]

print("\n" + "="*60)
print(f"🏆 BEST MODEL: {best_model_name}")
print(f"   F1 Score: {results[best_model_name]['F1']:.4f}")
print(f"   Accuracy: {results[best_model_name]['Accuracy']:.4f}")
print(f"   AUC: {results[best_model_name]['AUC']:.4f}")
print("="*60)

# Save model and artifacts
print("\n💾 Saving model and artifacts...")
joblib.dump(best_model, 'models/best_model.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(le_dict, 'models/label_encoders.pkl')
joblib.dump(feature_names, 'models/feature_names.pkl')

# Save model metadata
metadata = {
    'model_name': best_model_name,
    'f1_score': results[best_model_name]['F1'],
    'accuracy': results[best_model_name]['Accuracy'],
    'auc': results[best_model_name]['AUC'],
    'features': feature_names
}
joblib.dump(metadata, 'models/metadata.pkl')

print("✅ Model saved to 'models/' directory")
print("\n🎉 Training complete!")
