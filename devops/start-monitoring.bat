@echo off
echo ============================================================
echo  MATCHY DEVOPS STACK — STARTUP
echo ============================================================
echo.
echo This will start:
echo   - Prometheus  : http://localhost:9091
echo   - Grafana     : http://localhost:3000  (admin/matchy123)
echo   - SonarQube   : http://localhost:9000  (admin/admin)
echo.

REM Check Docker is running
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Starting monitoring stack...
docker compose -f docker-compose.monitoring.yml up -d

echo.
echo Waiting for services to start (60 seconds)...
timeout /t 60 /nobreak > nul

echo.
echo ============================================================
echo  SERVICES STATUS
echo ============================================================
docker compose -f docker-compose.monitoring.yml ps

echo.
echo ============================================================
echo  ACCESS URLS
echo ============================================================
echo   Prometheus : http://localhost:9091
echo   Grafana    : http://localhost:3000  (admin / matchy123)
echo   SonarQube  : http://localhost:9000  (admin / admin)
echo ============================================================
echo.
echo TIP: Run setup-sonarqube.sh after SonarQube is ready
echo      to create projects and quality gates automatically.
echo.
pause
