@echo off
title StockSense Live Link Generator
color 0B
echo.
echo ==========================================
echo   StockSense AI - Generating Live Link
echo ==========================================
echo.
echo Please wait, getting your public internet link using Pinggy...
echo.
ssh -o StrictHostKeyChecking=no -p 443 -R0:localhost:3000 a.pinggy.io
pause
