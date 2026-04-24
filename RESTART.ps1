# StockSense AI - Complete Restart Script
# Run this in PowerShell: Right-click → Run with PowerShell

Write-Host "Stopping processes on port 5000..." -ForegroundColor Yellow

# Kill port 5000
$port5000 = netstat -ano | Select-String ":5000 " | ForEach-Object {
    ($_ -split '\s+')[-1]
} | Select-Object -Unique
foreach ($pid in $port5000) {
    if ($pid -match '^\d+$' -and $pid -ne '0') {
        try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } catch {}
    }
}

Start-Sleep -Seconds 2

Write-Host "Starting Backend on port 5000..." -ForegroundColor Green
$serverPath = Join-Path $PSScriptRoot "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; node server.js" -WindowStyle Normal

Start-Sleep -Seconds 4

Write-Host "Opening browser at http://localhost:3000" -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "Done! Backend restarted." -ForegroundColor Green
