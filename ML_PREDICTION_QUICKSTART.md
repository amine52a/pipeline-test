# 🚀 ML Prediction Service - Quick Start Guide

## ⚡ 3-Minute Setup

### Step 1: Start the ML Service (Windows)

```bash
cd services/ml-prediction-service
start.bat
```

**What this does:**
- Creates Python virtual environment
- Installs all dependencies
- Generates sample dataset (1000 projects)
- Trains the ML model
- Starts the Flask API on port 8085

### Step 2: Verify It's Working

Open a new terminal and run:

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

### Step 3: Access the UI

Open your browser:
```
http://localhost:4200/backoffice/ml-prediction
```

## 🎯 Test with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Select file: `services/ml-prediction-service/ML_Prediction_Service.postman_collection.json`
4. Run "Health Check" request
5. Run "Predict Project Success - High Success" request

### Quick Test Request

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

## 📊 What You Get

### API Response Example

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
  "recommendation": "✅ Highly recommended to proceed. Project shows strong indicators of success."
}
```

### UI Features

- 📝 **Interactive Form**: Input project details
- 🎯 **Real-time Predictions**: Instant results
- 📊 **Visual Feedback**: Color-coded risk levels
- 💡 **AI Recommendations**: Smart suggestions
- 📈 **Probability Bars**: Visual success/failure chances
- 🏆 **Model Info**: Performance metrics

## 🔧 Troubleshooting

### Service Won't Start

**Check Python:**
```bash
python --version  # Should be 3.8+
```

**Manual Setup:**
```bash
cd services/ml-prediction-service
pip install -r requirements.txt
python generate_sample_data.py
python train_model.py
python app.py
```

### Port Already in Use

Edit `services/ml-prediction-service/.env`:
```env
PORT=8086  # Change to any available port
```

### Test the API

Run the test script:
```bash
cd services/ml-prediction-service
python test_api.py
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check service health |
| `/api/ml/model-info` | GET | Get model details |
| `/api/ml/predict` | POST | Predict single project |
| `/api/ml/batch-predict` | POST | Predict multiple projects |
| `/api/ml/features` | GET | List required features |

## 🎨 Frontend Access

**URL**: http://localhost:4200/backoffice/ml-prediction

**Navigation**: 
1. Login to backoffice
2. Click "ML Prediction" in sidebar
3. Fill in project details
4. Click "Predict Feasibility"
5. View results!

## 📚 Documentation

- **Setup Guide**: `services/ml-prediction-service/SETUP_GUIDE.md`
- **API Docs**: `services/ml-prediction-service/README.md`
- **Integration**: `ML_SERVICE_INTEGRATION.md`
- **Summary**: `ML_INTEGRATION_SUMMARY.md`

## ✅ Verification Checklist

- [ ] Python 3.8+ installed
- [ ] Service starts without errors
- [ ] Health check returns 200
- [ ] Test prediction works
- [ ] Frontend loads successfully
- [ ] Postman collection imported

## 🎉 Success!

If all steps work, you're ready to use the ML Prediction Service!

**Quick Links:**
- API: http://localhost:8085
- UI: http://localhost:4200/backoffice/ml-prediction
- Health: http://localhost:8085/health
- Model Info: http://localhost:8085/api/ml/model-info

## 💡 Tips

1. **First Time**: Let `start.bat` complete fully (may take 2-3 minutes)
2. **Predictions**: More features = better accuracy
3. **Batch Mode**: Use for analyzing multiple projects
4. **Risk Levels**: 
   - 🟢 LOW: >60% success probability
   - 🟡 MEDIUM: 40-60% success probability
   - 🔴 HIGH: <40% success probability

## 🚀 Next Steps

1. ✅ Start the service
2. ✅ Test with Postman
3. ✅ Try the UI
4. ✅ Make real predictions
5. ✅ Integrate into your workflow

---

**Need Help?** Check the detailed guides in the `services/ml-prediction-service/` directory.
