@echo off
cd /d "%~dp0"
title Bizzfilling Background Worker

echo ==========================================
echo      BIZZFILLING BACKGROUND LAUNCHER
echo ==========================================
echo.

:: 0. Kill existing processes
echo [1/4] Cleaning up old processes...
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul

:: 1. Check and Build Backend
echo [2/4] Checking Backend...
if not exist "backend\target\financial-backend-0.0.1-SNAPSHOT.jar" (
    echo Backend JAR not found. Building...
    cd backend
    call mvn clean install -DskipTests
    cd ..
)

if not exist "backend\target\financial-backend-0.0.1-SNAPSHOT.jar" (
    echo CRITICAL ERROR: Backend JAR build failed.
    pause
    exit /b 1
)

:: 2. Build Frontend
echo [3/4] Preparing Frontend...
cd frontend
echo Installing dependencies...
call npm install
echo Building Frontend...
call npm run build
cd ..

if not exist "frontend\dist" (
    echo CRITICAL ERROR: Frontend build failed.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo      ALL SYSTEMS READY!
echo      Starting Services in Background...
echo ==========================================

:: 3. Start Backend (Hidden with logs)
echo Starting Backend...
wscript _run_backend_hidden.vbs

:: 4. Start Frontend (Hidden with logs)
echo Starting Frontend...
wscript _run_frontend_hidden.vbs

echo.
echo Done! Window closing in 5 seconds...
timeout /t 5
exit
