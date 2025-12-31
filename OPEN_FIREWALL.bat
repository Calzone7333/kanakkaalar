@echo off
echo ====================================================
echo      Bizzfilling Firewall Configuration Tool
echo ====================================================
echo.
echo This script will open ports 8081 (Backend) and 5173 (Frontend)
echo to allow other computers on your network to access the app.
echo.
echo * IMPORTANT: You must run this as ADMINISTRATOR *
echo.
pause

echo.
echo 1. Opening Port 8081 (TCP)...
netsh advfirewall firewall add rule name="Bizzfilling Backend" dir=in action=allow protocol=TCP localport=8081
if %errorlevel% neq 0 echo [ERROR] Failed. Run as Administrator! & pause & exit

echo 2. Opening Port 5173 (TCP)...
netsh advfirewall firewall add rule name="Bizzfilling Frontend" dir=in action=allow protocol=TCP localport=5173

echo.
echo ====================================================
echo                 SUCCESS!
echo ====================================================
echo Ports 8081 and 5173 are now open.
echo.
echo You can now access the app from other PCs using:
echo Web: http://115.97.59.230:5173 (if that is your static IP)
echo      OR http://192.168.1.2:5173
echo.
pause
