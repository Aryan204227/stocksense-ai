@echo off
title Restarting StockSense Backend
color 0A

echo.
echo  Stopping existing processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do (
    if not "%%a"=="0" taskkill /f /pid %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

echo  Starting Backend...
cd /d "%~dp0server"
start "StockSense-Backend" cmd /k "color 0A && title StockSense Backend [PORT 5000] && node server.js"

echo  Backend restarted on port 5000
timeout /t 3 /nobreak >nul
echo  Done! Frontend at http://localhost:3000 is still running.
pause
