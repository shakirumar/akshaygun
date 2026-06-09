@echo off
REM Quick Start Script for Akshaygun (Windows)

echo.
echo 🚀 Starting Akshaygun - Complete Setup
echo ======================================
echo.

REM Check Node.js
node --version
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo 📦 Setting up Backend...
cd backend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Backend setup failed!
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env ^(please update with your credentials^)
) else (
    echo ✅ .env already exists
)
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd ..\frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Frontend setup failed!
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

echo ======================================
echo ✅ Setup Complete!
echo.
echo 📋 Next steps:
echo.
echo 1. Update backend\.env with your configuration:
echo    - MongoDB URI
echo    - Razorpay API keys
echo.
echo 2. Start Backend ^(in terminal 1^):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend ^(in terminal 2^):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Seed Database ^(optional, for sample data^):
echo    cd backend
echo    npm run seed
echo.
echo 🌐 Access:
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5000
echo.
echo Happy Selling! 🎉
echo.
pause
