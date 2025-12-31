@echo off
echo ==========================================
echo Stopping Bizzfilling Background Processes
echo ==========================================

echo Killing Java (Backend)...
taskkill /F /IM java.exe /T 2>nul

echo Killing Node (Frontend)...
taskkill /F /IM node.exe /T 2>nul

echo.
echo All Bizzfilling processes have been stopped.
pause
