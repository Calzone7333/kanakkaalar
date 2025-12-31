@echo off
title Bizzfilling App Manager
cls
:MENU
echo ====================================================
echo           BIZZFILLING APPLICATION MANAGER
echo ====================================================
echo.
echo  [1] START PRODUCTION (Visible Window)
echo      - Runs Backend & Frontend in this window.
echo.
echo  [2] START IN BACKGROUND (Hidden)
echo      - Runs everything silently.
echo.
echo  [3] STOP BACKGROUND APP
echo      - Kills running processes.
echo.
echo  [4] BUILD DESKTOP APPLICATION (.exe)
echo      - Builds Windows Installer.
echo.
echo  [5] PREPARE MOBILE APP (Android/iOS)
echo      - Builds web assets and syncs with Capacitor.
echo      - Opens Android Studio or Xcode.
echo.
echo  [6] EXIT
echo.
echo ====================================================
set /p choice="Select an option (1-6): "

if "%choice%"=="1" goto START_VISIBLE
if "%choice%"=="2" goto START_HIDDEN
if "%choice%"=="3" goto STOP_APP
if "%choice%"=="4" goto BUILD_DESKTOP
if "%choice%"=="5" goto BUILD_MOBILE
if "%choice%"=="6" exit

echo Invalid choice. Please try again.
pause
goto MENU

:START_VISIBLE
cls
echo [STARTING VISIBLE PRODUCTION]
echo.
echo 0. Cleaning up old processes...
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 >nul

echo 1. Starting Backend...
start "Bizzfilling Backend" java -jar backend/target/financial-backend-0.0.1-SNAPSHOT.jar
timeout /t 5 >nul
echo 2. Starting Web App...
cd frontend
call npm install
call npm run build
start "Bizzfilling Web App" npx serve -s dist -l 5173 --cors
echo.
echo Application Started!
echo Web: http://115.97.59.230:5173
pause
goto MENU

:START_HIDDEN
cls
echo [STARTING IN BACKGROUND]
echo.
echo Launching services silently...
echo Please wait a moment for the build to complete.
wscript RUN_BACKGROUND.vbs
echo.
echo Done! The app is starting in the background.
echo It may take 1-2 minutes to become available.
echo Check 'startup_log.txt' for progress.
echo.
pause
goto MENU

:STOP_APP
call STOP_APP.bat
goto MENU

:BUILD_DESKTOP
cls
echo [BUILDING DESKTOP APPLICATION]
echo.
cd frontend
echo 1. Cleaning old builds...
if exist release rmdir /s /q release
if exist dist rmdir /s /q dist
echo 2. Packaging Electron App...
call npm run electron:build
echo.
echo Build Complete!
echo Installer: frontend\release\Bizzfilling Setup 0.1.0.exe
pause
cd ..
goto MENU

:BUILD_MOBILE
cls
echo [PREPARING MOBILE APPLICATION]
echo.
cd frontend
echo 1. Building React App (Web Assets)...
call npm run build
echo.
echo 2. Syncing with Capacitor (Android/iOS)...
call npx cap sync
echo.
echo ==========================================
echo       MOBILE SYNC COMPLETE
echo ==========================================
echo.
echo What would you like to do next?
echo [A] Open Android Studio (to build APK)
echo [I] Open Xcode (iOS - Mac Only)
echo [M] Return to Menu
echo.
set /p mchoice="Select option: "
if /i "%mchoice%"=="A" (
    echo Opening Android Studio...
    call npx cap open android
    pause
)
if /i "%mchoice%"=="I" (
    echo Opening Xcode...
    call npx cap open ios
    pause
)
cd ..
goto MENU
