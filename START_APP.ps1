# StockSense AI - Auto Start Script
# Double-click ya PowerShell mein run karo: .\START_APP.ps1

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   StockSense AI - Starting Up..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Ports clear karo
Write-Host "[1/4] Clearing ports 3000 and 5000..." -ForegroundColor Yellow
@(3000, 5000) | ForEach-Object {
    $port = $_
    $pids = netstat -ano | Select-String ":$port " | ForEach-Object { ($_ -split '\s+')[-1] } | Where-Object { $_ -match '^\d+$' } | Sort-Object -Unique
    foreach ($p in $pids) {
        if ($p -gt 0) {
            try { Stop-Process -Id $p -Force -ErrorAction Stop; Write-Host "  Killed PID $p on port $port" -ForegroundColor Gray } catch {}
        }
    }
}
Start-Sleep -Seconds 1

# Step 2: Backend check + start
Write-Host "[2/4] Starting Backend (port 5000)..." -ForegroundColor Yellow
$serverPath = Join-Path $projectRoot "server"
if (-not (Test-Path (Join-Path $serverPath "node_modules"))) {
    Write-Host "  Installing backend dependencies..." -ForegroundColor Gray
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd `"$serverPath`" && npm install" -Wait -NoNewWindow
}
Start-Process -FilePath "cmd.exe" -ArgumentList "/k title StockSense-Backend && cd `"$serverPath`" && node server.js" -WindowStyle Normal

# Step 3: Frontend check + start  
Write-Host "[3/4] Starting Frontend (port 3000)..." -ForegroundColor Yellow
$clientPath = Join-Path $projectRoot "client"
if (-not (Test-Path (Join-Path $clientPath "node_modules"))) {
    Write-Host "  Installing frontend dependencies..." -ForegroundColor Gray
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd `"$clientPath`" && npm install" -Wait -NoNewWindow
}
Start-Process -FilePath "cmd.exe" -ArgumentList "/k title StockSense-Frontend && cd `"$clientPath`" && npm run dev" -WindowStyle Normal

# Step 4: Wait and open browser
Write-Host "[4/4] Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 7
Write-Host ""
Write-Host "  Opening http://localhost:3000 ..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  SUCCESS! StockSense AI is Running!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
