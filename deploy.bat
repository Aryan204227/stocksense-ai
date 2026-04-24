@echo off
title StockSense AI - One-Click Deploy
color 0A

echo ========================================================
echo         STOCKSENSE AI - AUTO DEPLOYMENT SCRIPT
echo ========================================================
echo.
echo Bhai, deployment ke liye code ko internet (GitHub) par 
echo bhejna zaroori hai. Uske baad Render/Vercel usko apne
echo aap live kar denge!
echo.
echo STEP 1: Apna GitHub open karo: https://github.com/new
echo STEP 2: Ek naya empty project banao (naam: stocksense-ai)
echo STEP 3: Wahan se naye project ka URL copy karo.
echo         (Jaise: https://github.com/yourname/stocksense-ai.git)
echo.

set /p GITHUB_URL="Yahan apna GitHub URL paste karo aur Enter dabao: "

if "%GITHUB_URL%"=="" (
    echo Error: URL khali nahi ho sakta!
    pause
    exit
)

echo.
echo Code internet par upload ho raha hai, please wait...
echo.

git init
git add .
git commit -m "Deploying StockSense AI"
git branch -M main
git remote add origin %GITHUB_URL%
git push -u origin main -f

echo.
echo ========================================================
echo  SUCCESS! Aapka code GitHub par chala gaya hai! ✅
echo ========================================================
echo.
echo AAKHRI STEP (Final Step):
echo 1. https://render.com par jao aur Login karo.
echo 2. "New +" par click karke "Web Service" select karo.
echo 3. Apna GitHub account connect karo aur stocksense-ai select karo.
echo 4. Render khud-ba-khud sab kuch setup kar dega!
echo.
echo Aapki website 5 minute mein hamesha ke liye LIVE ho jayegi! 🚀
echo.
pause
