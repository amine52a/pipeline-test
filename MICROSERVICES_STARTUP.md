# Microservices Architecture - Startup Guide

## Architecture Overview

```
Angular (4200) → API Gateway (8091) → Eureka (8761) → Backend Service (9090) → MySQL
```

## Services

1. **Eureka Server** - Service Discovery (Port 8761)
2. **API Gateway** - Single Entry Point (Port 8091)
3. **Backend Service** - Node.js API (Port 9090)
4. **Angular Frontend** - UI (Port 4200)

## Start Services (In Order)

### 1. Start Eureka Server
```bash
cd eureka-server
mvn spring-boot:run
```
Wait for: "Eureka Server Started Successfully!"
Check: http://localhost:8761

### 2. Start API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```
Wait for: "API Gateway Started Successfully!"
Check: http://localhost:8091

### 3. Start Backend Service
```bash
cd backend
npm start
```
Wait for: "Successfully registered with Eureka Server"
Check: http://localhost:9090

### 4. Start Angular Frontend
```bash
npm start
```
Wait for: "Application bundle generation complete"
Open: http://localhost:4200

## Verification

1. Check Eureka Dashboard: http://localhost:8761
   - Should see: BACKEND-SERVICE registered

2. Test API through Gateway:
   ```bash
   curl http://localhost:8091/api/projects
   ```

3. Open Angular app: http://localhost:4200

## Architecture Benefits

- **Service Discovery**: Eureka automatically discovers services
- **Load Balancing**: Gateway distributes requests
- **Single Entry Point**: All requests go through port 8091
- **Scalability**: Easy to add more services
- **Monitoring**: Eureka dashboard shows all services

## Ports Summary

- 8761: Eureka Server
- 8091: API Gateway
- 9090: Backend Service
- 4200: Angular Frontend
- 3306: MySQL Database
