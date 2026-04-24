@echo off
title Final Deploy Script
color 0A

echo ========================================================
echo         PUSHING CODE TO GITHUB AUTOMATICALLY
echo ========================================================
echo.

:: Fix Git Config just in case it's a new PC
git config --global user.name "Aryan"
git config --global user.email "aryan204227@github.com"

git init
git add .
git commit -m "Final Deploy - StockSense AI"

:: Force remove old remote if it exists, then add the new one
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Aryan204227/stocksense-ai.git

git branch -M main
git push -u origin main -f

echo.
echo ========================================================
echo  AGAR UPAR "SUCCESS" LIKHA AAYA HAI TOH AAGE BADHO!
echo ========================================================
echo.
echo AAKHRI CHHOTA SA STEP:
echo 1. Apne browser mein jao: https://render.com
echo 2. Login karo, "New +" par click karo aur "Web Service" select karo.
echo 3. Apna "Aryan204227/stocksense-ai" repository select karo.
echo 4. "Create" daba do!
echo.
echo 5 Minute mein aapki website hamesha ke liye LIVE ho jayegi!
echo.
pause
