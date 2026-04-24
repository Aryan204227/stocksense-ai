@echo off
setlocal
echo ============================================================
echo   StockSense AI v3.0 - Premium Stock Sentiment Platform
echo ============================================================
echo.

:: Kill any processes on port 5000 and 3000 first
echo [1/4] Clearing occupied ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do taskkill /f /pid %%a >nul 2>&1
timeout /t 2 >nul

echo [2/4] Starting Backend Server (Port 5000)...
start "StockSense Backend" cmd /k "cd /d "%~dp0server" && npm install --silent && node server.js"

echo [3/4] Starting Frontend (Port 3000)...
start "StockSense Frontend" cmd /k "cd /d "%~dp0client" && npm install --silent && npm run dev"

echo.
echo [4/4] Waiting for servers to initialize (12 seconds)...
timeout /t 12 >nul

echo.
echo ============================================================
echo   GENERATING PUBLIC INTERNET LINK via LocalTunnel...
echo ============================================================
echo.
echo   The URL starting with https:// is your LIVE PUBLIC LINK.
echo   Share it or open it in a browser to access StockSense AI.
echo.
echo   Local access: http://localhost:3000
echo.
npx localtunnel --port 3000

pause
