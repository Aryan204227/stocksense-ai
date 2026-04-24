@echo off
title StockSense AI - Hard Reset and Start
color 0C

echo.
echo  ========================================
echo   StockSense AI - Hard Resetting System
echo  ========================================
echo.

:: Kill existing processes
echo  [1/4] Killing existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a 2>nul

echo.
echo  [2/4] Resetting Client (Clean Install)...
cd "%~dp0client"
rd /s /q node_modules 2>nul
del package-lock.json 2>nul
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [!] Client installation failed.
    pause
    exit /b
)

echo.
echo  [3/4] Resetting Server (Clean Install)...
cd "%~dp0server"
rd /s /q node_modules 2>nul
del package-lock.json 2>nul
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [!] Server installation failed.
    pause
    exit /b
)

echo.
echo  [4/4] Starting Services...
start "StockSense Backend" cmd /k "title StockSense Backend && node server.js"
start "StockSense Frontend" cmd /k "title StockSense Frontend && npm run dev"

echo.
echo  ✅ System reset complete! 
echo  Waiting 8 seconds for startup...
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo  Website should be open at http://localhost:3000
pause
