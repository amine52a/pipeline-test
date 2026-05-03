# How to Start All Services - Step by Step 🚀

## Prerequisites
- Java 17+ installed
- Maven installed
- Node.js 18+ installed
- MySQL running with matchy_db database

---

## Start Services (In Order)

### Step 1: Start Eureka Server (Terminal 1)
```powershell
cd eureka-server
mvn spring-boot:run
```

**Wait for**: "Eureka Server Started Successfully!"  
**Check**: http://localhost:8761  
**Time**: ~30 seconds

---

### Step 2: Start API Gateway (Terminal 2)
```powershell
cd api-gateway
mvn spring-boot:run
```

**Wait for**: "API Gateway Started Successfully!"  
**Check**: http://localhost:8080  
**Time**: ~20 seconds

---

### Step 3: Start Milestone Service (Terminal 3)
```powershell
cd milestone-service
npm install  # First time only
npm start
```

**Wait for**: "Successfully registered with Eureka Server"  
**Check**: http://localhost:4000/health  
**Time**: ~10 seconds

---

### Step 4: Start Angular Frontend (Terminal 4)
```powershell
# From project root
npm start
```

**Wait for**: "Application bundle generation complete"  
**Open**: http://localhost:4200  
**Time**: ~10 seconds

---

## Verification

### 1. Check Eureka Dashboard
```
http://localhost:8761
```
✅ Should see: **MILESTONE-SERVICE** registered

### 2. Check Services
```powershell
# API Gateway (may not have /actuator/health yet)
curl http://localhost:8080

# Milestone Service
curl http://localhost:4000/health

# Frontend
curl http://localhost:4200
```

### 3. Test API
```powershell
curl http://localhost:8080/api/projects
```

---

## Quick Commands

### Check if ports are in use:
```powershell
netstat -ano | Select-String ":8761|:8080|:4000|:4200"
```

### Kill process on port (if needed):
```powershell
# Find PID
netstat -ano | Select-String ":8761"

# Kill process
taskkill /PID <PID> /F
```

---

## Troubleshooting

### Port already in use?
```powershell
# Kill the process
netstat -ano | Select-String ":8761"
taskkill /PID <PID> /F
```

### Maven not found?
```powershell
# Check Maven installation
mvn -version

# If not installed, download from: https://maven.apache.org/download.cgi
```

### Java version wrong?
```powershell
# Check Java version
java -version

# Need Java 17 or higher
```

---

## Stop All Services

Press `Ctrl+C` in each terminal window.

---

## Status Check

All services running when you see:
- ✅ Eureka: http://localhost:8761 (shows dashboard)
- ✅ Gateway: http://localhost:8080 (responds)
- ✅ Service: http://localhost:4000/health (returns JSON)
- ✅ Frontend: http://localhost:4200 (loads app)

---

**Ready!** 🎉
