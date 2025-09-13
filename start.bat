@echo off
echo Starting Multi-Tenant CRM System...

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not installed. Please install Maven 3.6 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo All prerequisites are met. Starting the application...

REM Start the backend
echo Starting Spring Boot backend...
start "Backend" cmd /k "mvn spring-boot:run"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 30 /nobreak >nul

REM Start the frontend
echo Starting React frontend...
cd frontend
start "Frontend" cmd /k "npm install && npm start"

echo Application started successfully!
echo Backend: http://localhost:8090
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (the services will continue running)
pause >nul
