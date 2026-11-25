@echo off
title Cafeo React Application
echo ===================================================
echo Starting Cafeo React Website on Port 3000...
echo ===================================================
cd /d "%~dp0"
start http://localhost:3000
npm run dev -- --port 3000
pause
