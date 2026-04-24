@echo off
title StockSense Restart
color 0A

echo ================================
echo  StockSense AI - Full Restart
echo ================================
echo.

echo [1/3] Killing old Node processes...
taskkill /f /im node.exe >nul 2>&1
ping -n 3 127.0.0.1 >nul

echo [2/3] Starting Backend (port 5000)...
start "StockSense-Backend" cmd /k "title Backend ^| port 5000 && cd /d "%~dp0server" && echo Backend starting... && node server.js"
ping -n 5 127.0.0.1 >nul

echo [3/3] Starting Frontend (port 3000)...
start "StockSense-Frontend" cmd /k "title Frontend ^| port 3000 && cd /d "%~dp0client" && npm run dev"
ping -n 8 127.0.0.1 >nul

echo.
echo Opening browser...
start "" "http://localhost:3000"

echo.
echo ================================
echo  Done! App running at:
echo  http://localhost:3000
echo ================================
pause
