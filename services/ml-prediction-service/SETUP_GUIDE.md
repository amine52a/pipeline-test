# 🚀 ML Prediction Service - Complete Setup Guide

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- MySQL database running
- Eureka Server running (port 8761)

## 🔧 Step-by-Step Setup

### Step 1: Navigate to Service Directory

```bash
cd services/ml-prediction-service
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (Web framework)
- pandas, numpy (Data processing)
- scikit-learn (ML algorithms)
- XGBoost (Gradient boosting)
- imbalanced-learn (SMOTE)
- py-eureka-client (Service discovery)

### Step 4: Generate Sample Dataset

```bash
python generate_sample_data.py
```

This creates `project_feasibility_dataset.csv` with 1000 sample projects.

### Step 5: Train the Model

```bash
python train_model.py
```

Expected output:
```
🚀 TRAINING PROJECT FEASIBILITY PREDICTION MODEL
📂 Loading dataset...
✅ Dataset loaded: 1000 rows, 12 columns
🧹 Cleaning data...
✅ Data cleaned
🔤 Encoding categorical variables...
✅ Encoded 6 categorical columns
⚖️  Scaling features...
✅ Features scaled
📊 Data split: 800 train, 200 test
🔥 Applying SMOTE for class balancing...
✅ Balanced: 800 → 1200 samples
🤖 Training models...
   Training Random Forest...
   ✅ F1: 0.9234 | AUC: 0.9567
   Training XGBoost...
   ✅ F1: 0.9456 | AUC: 0.9678
🏆 BEST MODEL: XGBoost
   F1 Score: 0.9456
   Accuracy: 0.9156
   AUC: 0.9678
💾 Saving model and artifacts...
✅ Model saved to 'models/' directory
🎉 Training complete!
```

### Step 6: Start the Service

```bash
python app.py
```

Expected output:
```
🔄 Loading ML model and artifacts...
✅ Model loaded successfully!
   Model: XGBoost
   F1 Score: 0.9456
✅ Registered with Eureka at http://localhost:8761/eureka
============================================================
🚀 ML PREDICTION SERVICE
============================================================
   Port: 8085
   Eureka: http://localhost:8761/eureka
============================================================
 * Running on http://0.0.0.0:8085
```

## ✅ Verification

### 1. Check Health

```bash
curl http://localhost:8085/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ml-prediction-service",
  "model_loaded": true
}
```

### 2. Get Model Info

```bash
curl http://localhost:8085/api/ml/model-info
```

### 3. Make a Prediction

```bash
curl -X POST http://localhost:8085/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 50000,
    "team_size": 5,
    "duration_months": 6,
    "complexity": "medium",
    "client_experience": "high"
  }'
```

## 🧪 Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click "Import"
3. Use the file: `ML_Prediction_Service.postman_collection.json`

### Available Requests

1. **Health Check** - GET `/health`
2. **Model Info** - GET `/api/ml/model-info`
3. **Single Prediction** - POST `/api/ml/predict`
4. **Batch Prediction** - POST `/api/ml/batch-predict`
5. **Get Features** - GET `/api/ml/features`

## 🔗 Integration with Frontend

The Angular frontend is already configured to use this service.

Access the ML Prediction interface:
```
http://localhost:4200/backoffice/ml-prediction
```

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| ML Prediction Service | 8085 | http://localhost:8085 |
| API Gateway | 8091 | http://localhost:8091 |
| Eureka Server | 8761 | http://localhost:8761 |
| Angular Frontend | 4200 | http://localhost:4200 |

## 🐛 Troubleshooting

### Issue: "Model not loaded"

**Solution:**
```bash
python train_model.py
```

### Issue: "Port 8085 already in use"

**Solution:**
Edit `.env` file and change PORT:
```env
PORT=8086
```

### Issue: "Eureka registration failed"

**Solution:**
1. Ensure Eureka server is running on port 8761
2. Check `.env` file for correct EUREKA_SERVER URL

### Issue: "Module not found"

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "Dataset not found"

**Solution:**
```bash
python generate_sample_data.py
```

## 📁 File Structure

```
ml-prediction-service/
├── app.py                          # Flask API
├── train_model.py                  # Model training script
├── generate_sample_data.py         # Dataset generator
├── requirements.txt                # Python dependencies
├── .env                           # Configuration
├── README.md                      # Documentation
├── SETUP_GUIDE.md                 # This file
├── models/                        # Trained models (generated)
│   ├── best_model.pkl
│   ├── scaler.pkl
│   ├── label_encoders.pkl
│   ├── feature_names.pkl
│   └── metadata.pkl
└── project_feasibility_dataset.csv # Training data (generated)
```

## 🔐 Security Notes

- This service is for internal use only
- Add authentication if exposing to public
- Use HTTPS in production
- Validate all input data
- Rate limit API endpoints

## 🚀 Production Deployment

### Using Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8085

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t ml-prediction-service .
docker run -p 8085:8085 ml-prediction-service
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs in the console
3. Ensure all prerequisites are met
4. Verify all services are running

## ✅ Quick Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Dataset generated (`python generate_sample_data.py`)
- [ ] Model trained (`python train_model.py`)
- [ ] Service started (`python app.py`)
- [ ] Health check passed
- [ ] Eureka registration successful
- [ ] Test prediction successful

## 🎉 Success!

If all steps completed successfully, your ML Prediction Service is ready to use!

Access it at: **http://localhost:8085**

Frontend interface: **http://localhost:4200/backoffice/ml-prediction**
