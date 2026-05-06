@echo off
echo ============================================================
echo  ML PREDICTION SERVICE - QUICK START
echo ============================================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Check if dataset exists
if not exist "project_feasibility_dataset.csv" (
    echo Generating sample dataset...
    python generate_sample_data.py
    echo.
)

REM Check if model exists
if not exist "models\best_model.pkl" (
    echo Training ML model...
    python train_model.py
    echo.
)

REM Start the service
echo Starting ML Prediction Service...
echo.
python app.py
