@echo off
title StockSense AI - Launcher
color 0B

echo.
echo  ==========================================
echo    StockSense AI v4 - Starting...
echo  ==========================================
echo.

:: ── Kill existing processes on port 3000 and 5000 ──
echo  [1/4] Clearing ports 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do (
    if not "%%a"=="0" taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do (
    if not "%%a"=="0" taskkill /f /pid %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

:: ── Check Node.js is installed ──
node -v >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js is not installed!
    echo  Download from https://nodejs.org
    pause
    exit /b 1
)

:: ── Install server dependencies if needed ──
echo  [2/4] Starting Backend on port 5000...
cd /d "%~dp0server"
if not exist node_modules (
    echo      Installing server dependencies...
    call npm install --silent
)
start "StockSense-Backend" cmd /k "color 0A && title StockSense Backend [PORT 5000] && echo. && echo  Backend starting... && echo. && node server.js"
timeout /t 4 /nobreak >nul

:: ── Install client dependencies if needed ──
echo  [3/4] Starting Frontend on port 3000...
cd /d "%~dp0client"
if not exist node_modules (
    echo      Installing client dependencies...
    call npm install --silent
)
start "StockSense-Frontend" cmd /k "color 0B && title StockSense Frontend [PORT 3000] && echo. && echo  Frontend starting... && echo. && npm run dev"

:: ── Wait then open browser ──
echo  [4/4] Waiting for servers to start...
timeout /t 8 /nobreak >nul

echo.
echo  Opening browser at http://localhost:3000 ...
start "" "http://localhost:3000"

echo.
echo  ============================================================
echo    SUCCESS! StockSense AI is running!
echo.
echo    Frontend  :  http://localhost:3000
echo    Backend   :  http://localhost:5000
echo    API Check :  http://localhost:5000/api/health
echo    API Status:  http://localhost:5000/api/status
echo  ============================================================
echo.
echo  Keep BOTH terminal windows open while using the app.
echo  Press any key to close this launcher window.
echo.
pause
