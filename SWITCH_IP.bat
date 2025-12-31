@echo off
title Bizzfilling IP Switcher
cls
echo ====================================================
echo           BIZZFILLING IP CONFIGURATION
echo ====================================================
echo.
echo Current IP Configuration:
type frontend\.env.production
echo.
echo ====================================================
echo.
echo  [1] SWITCH TO LOCAL NETWORK (192.168.1.2)
echo      - Use this for testing on WiFi with phones/laptops.
echo      - Best for: "Local network is not working" issues.
echo.
echo  [2] SWITCH TO PUBLIC INTERNET (115.97.59.230)
echo      - Use this when deploying to the real server.
echo      - Or if you have Port Forwarding set up correctly.
echo.
echo ====================================================
set /p choice="Select an option (1-2): "

if "%choice%"=="1" goto LOCAL
if "%choice%"=="2" goto PUBLIC

:LOCAL
echo VITE_API_URL=http://192.168.1.2:8081 > frontend\.env.production
echo.
echo [SUCCESS] Switched to LOCAL IP (192.168.1.2).
echo * IMPORTANT: You must REBUILD the app (Option 4 or 5 in START_APP) for this to take effect. *
pause
exit

:PUBLIC
echo VITE_API_URL=http://115.97.59.230:8081 > frontend\.env.production
echo.
echo [SUCCESS] Switched to PUBLIC IP (115.97.59.230).
echo * IMPORTANT: You must REBUILD the app (Option 4 or 5 in START_APP) for this to take effect. *
pause
exit
