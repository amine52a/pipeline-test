@echo off
setlocal

set SONAR_URL=http://localhost:9000
set SONAR_TOKEN=sqa_b550b7d6a0f088f734bb36738b97579656bf235b
set BASE=%~dp0..\..

echo ============================================================
echo  MATCHY SONARQUBE ANALYSIS — Running all services
echo ============================================================
echo.

REM ── Event Service ──
echo [1/5] Analysing Event Service...
cd /d "%BASE%\services\event-service"
call mvn sonar:sonar ^
  "-Dsonar.host.url=%SONAR_URL%" ^
  "-Dsonar.token=%SONAR_TOKEN%" ^
  "-Dsonar.projectKey=matchy-event-service" ^
  "-Dsonar.java.binaries=target/classes" ^
  -B -q
if %errorlevel% equ 0 (echo    OK) else (echo    FAILED)

REM ── Content Service ──
echo [2/5] Analysing Content Service...
cd /d "%BASE%\services\content-service"
call mvn sonar:sonar ^
  "-Dsonar.host.url=%SONAR_URL%" ^
  "-Dsonar.token=%SONAR_TOKEN%" ^
  "-Dsonar.projectKey=matchy-content-service" ^
  "-Dsonar.java.binaries=target/classes" ^
  -B -q
if %errorlevel% equ 0 (echo    OK) else (echo    FAILED)

REM ── Subscription Service ──
echo [3/5] Analysing Subscription Service...
cd /d "%BASE%\services\subscription-service"
call mvn sonar:sonar ^
  "-Dsonar.host.url=%SONAR_URL%" ^
  "-Dsonar.token=%SONAR_TOKEN%" ^
  "-Dsonar.projectKey=matchy-subscription-service" ^
  "-Dsonar.java.binaries=target/classes" ^
  -B -q
if %errorlevel% equ 0 (echo    OK) else (echo    FAILED)

REM ── Backend (Node.js) via sonar-scanner in Jenkins container ──
echo [4/5] Analysing Backend (Node.js)...
docker run --rm ^
  -v "%BASE%\backend:/usr/src" ^
  --add-host=host.docker.internal:host-gateway ^
  sonarsource/sonar-scanner-cli:latest ^
  sonar-scanner ^
  "-Dsonar.projectKey=matchy-backend" ^
  "-Dsonar.sources=/usr/src" ^
  "-Dsonar.exclusions=**/node_modules/**,**/__tests__/**" ^
  "-Dsonar.host.url=http://host.docker.internal:9000" ^
  "-Dsonar.login=%SONAR_TOKEN%"
if %errorlevel% equ 0 (echo    OK) else (echo    FAILED)

REM ── ML Service (Python) via sonar-scanner ──
echo [5/5] Analysing ML Prediction Service (Python)...
docker run --rm ^
  -v "%BASE%\services\ml-prediction-service:/usr/src" ^
  --add-host=host.docker.internal:host-gateway ^
  sonarsource/sonar-scanner-cli:latest ^
  sonar-scanner ^
  "-Dsonar.projectKey=matchy-ml-service" ^
  "-Dsonar.sources=/usr/src" ^
  "-Dsonar.exclusions=**/models/**,**/__pycache__/**,**/*.pkl,**/project_feasibility_dataset.csv" ^
  "-Dsonar.host.url=http://host.docker.internal:9000" ^
  "-Dsonar.login=%SONAR_TOKEN%"
if %errorlevel% equ 0 (echo    OK) else (echo    FAILED)

echo.
echo ============================================================
echo  Analysis complete! View results at:
echo  http://localhost:9000
echo ============================================================
pause
