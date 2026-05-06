@echo off
echo ============================================================
echo  MATCHY JENKINS — STARTUP
echo ============================================================
echo.
echo This will start:
echo   - Jenkins : http://localhost:8080
echo.

REM Check Docker is running
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Building and starting Jenkins...
docker compose -f docker-compose.jenkins.yml up -d --build

echo.
echo Waiting for Jenkins to start (90 seconds)...
timeout /t 90 /nobreak > nul

echo.
echo ============================================================
echo  JENKINS STATUS
echo ============================================================
docker compose -f docker-compose.jenkins.yml ps

echo.
echo ============================================================
echo  ACCESS
echo ============================================================
echo   Jenkins : http://localhost:8080
echo   User    : admin
echo   Pass    : matchy-jenkins-2024
echo ============================================================
echo.
echo NEXT STEPS:
echo   1. Open Jenkins at http://localhost:8080
echo   2. Go to Manage Jenkins ^> Credentials
echo   3. Add your Docker Hub credentials (ID: dockerhub-credentials)
echo   4. Add your SonarQube token (ID: sonarqube-token)
echo   5. Create a Pipeline job pointing to your Jenkinsfile
echo.
pause
