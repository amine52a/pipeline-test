# 🚀 Start All Services - Complete Guide

## ✅ Currently Running Services

Your existing services are already running:

| Service | Port | Status | Terminal ID |
|---------|------|--------|-------------|
| **Eureka Server** | 8761 | ✅ Running | 1 |
| **API Gateway** | 8091 | ✅ Running | 2 |
| **Content Service** | 8083 | ✅ Running | 3 |
| **Event Service** | 8081 | ✅ Running | 4 |
| **Subscription Service** | 8084 | ✅ Running | 5 |
| **Angular Frontend** | 4200 | ✅ Running | 7 |
| **Backend Service** | 9090 | ✅ Running | 9 |

## 🤖 ML Prediction Service Setup

### ⚠️ Python Required

The ML Prediction Service requires Python 3.8 or higher, which is not currently installed on your system.

### Option 1: Install Python (Recommended)

1. **Download Python**:
   - Visit: https://www.python.org/downloads/
   - Download Python 3.11 or 3.12 (latest stable)
   - **IMPORTANT**: Check "Add Python to PATH" during installation

2. **Verify Installation**:
   ```bash
   python --version
   ```

3. **Start ML Service**:
   ```bash
   cd services/ml-prediction-service
   start.bat
   ```

### Option 2: Use Without ML Service

Your platform works perfectly without the ML service. The ML Prediction feature is optional and isolated.

**What works without ML:**
- ✅ All existing features
- ✅ Projects & Milestones
- ✅ Events & Registrations
- ✅ Subscriptions & Payments
- ✅ Content Management
- ✅ User Management
- ✅ Everything else!

**What requires ML service:**
- ❌ AI Project Feasibility Predictions (only this feature)

## 🎯 Quick Access URLs

### Main Application
- **Frontend**: http://localhost:4200
- **API Gateway**: http://localhost:8091
- **Eureka Dashboard**: http://localhost:8761

### Individual Services
- **Backend API**: http://localhost:9090
- **Content Service**: http://localhost:8083
- **Event Service**: http://localhost:8081
- **Subscription Service**: http://localhost:8084
- **ML Service**: http://localhost:8085 (when Python installed)

## 📊 Service Status Check

### Check All Services

```bash
# Eureka Dashboard (shows all registered services)
curl http://localhost:8761

# Backend Health
curl http://localhost:9090/api/health

# Frontend
curl http://localhost:4200
```

## 🔧 If You Want to Install Python

### Windows Installation Steps:

1. **Download**:
   - Go to: https://www.python.org/downloads/windows/
   - Click "Download Python 3.12.x"

2. **Install**:
   - Run the installer
   - ✅ **CHECK** "Add python.exe to PATH"
   - Click "Install Now"

3. **Verify**:
   ```bash
   python --version
   pip --version
   ```

4. **Setup ML Service**:
   ```bash
   cd services/ml-prediction-service
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Generate sample data
   python generate_sample_data.py
   
   # Train model
   python train_model.py
   
   # Start service
   python app.py
   ```

### Alternative: Use Anaconda

1. Download Anaconda: https://www.anaconda.com/download
2. Install Anaconda
3. Open Anaconda Prompt
4. Navigate to project and run setup

## 🚀 Complete Startup Sequence (With Python)

Once Python is installed:

```bash
# 1. Eureka Server (already running)
cd eureka-server
mvn spring-boot:run

# 2. API Gateway (already running)
cd api-gateway
mvn spring-boot:run

# 3. Backend Service (already running)
cd backend
npm start

# 4. Content Service (already running)
cd services/content-service
mvn spring-boot:run

# 5. Event Service (already running)
cd services/event-service
mvn spring-boot:run

# 6. Subscription Service (already running)
cd services/subscription-service
mvn spring-boot:run

# 7. ML Prediction Service (NEW - needs Python)
cd services/ml-prediction-service
python app.py

# 8. Angular Frontend (already running)
npm start
```

## 📋 Service Dependencies

```
┌─────────────────────────────────────────┐
│     Angular Frontend (4200)             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     API Gateway (8091)                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Eureka Server (8761)                │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┬──────────┬────────────┐
    ▼          ▼          ▼          ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Backend │ │Content │ │ Event  │ │  Sub   │ │   ML   │
│ (9090) │ │ (8083) │ │ (8081) │ │ (8084) │ │ (8085) │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
                                              (Optional)
```

## ✅ Current Status Summary

### ✅ Working Now (7/8 services)

1. ✅ Eureka Server - Service Discovery
2. ✅ API Gateway - Entry Point
3. ✅ Backend Service - Main API
4. ✅ Content Service - Content Management
5. ✅ Event Service - Events & Registrations
6. ✅ Subscription Service - Subscriptions & Payments
7. ✅ Angular Frontend - User Interface

### ⏳ Pending (1/8 services)

8. ⏳ ML Prediction Service - Requires Python installation

## 🎉 You're 87.5% Ready!

Your platform is **fully functional** right now! The ML service is an **optional enhancement** that adds AI-powered project feasibility predictions.

### What You Can Do Now:

✅ Access the application: http://localhost:4200
✅ Use all existing features
✅ Manage projects, events, subscriptions
✅ Everything works perfectly!

### To Add ML Predictions:

1. Install Python 3.8+
2. Run the ML service setup
3. Access ML predictions at `/backoffice/ml-prediction`

## 📞 Need Help?

### Python Installation Issues:
- Make sure to check "Add to PATH" during installation
- Restart your terminal after installation
- Try `python --version` to verify

### Service Issues:
- Check if ports are available
- Verify Eureka is running first
- Check logs in each terminal

### ML Service Specific:
- See: `services/ml-prediction-service/SETUP_GUIDE.md`
- See: `ML_PREDICTION_QUICKSTART.md`

## 🎊 Conclusion

**Current State**: 7/8 services running (87.5%)
**Status**: ✅ Fully functional platform
**ML Service**: Optional - Install Python to enable

Your Matchy platform is ready to use! 🚀
