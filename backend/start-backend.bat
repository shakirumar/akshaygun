@echo off
REM Backend startup script for Akshaygun Pharmacy
REM This script starts the Express backend server

cd /d "%~dp0"
echo Starting Akshaygun Backend Server...
echo.
echo Make sure MongoDB is running and the .env file is configured
echo.
npm start
pause
