#!/bin/bash
# Quick Start Script for Akshaygun

echo "🚀 Starting Akshaygun - Complete Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install --legacy-peer-deps
echo "✅ Backend dependencies installed"
echo ""

echo "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env (please update with your credentials)"
else
    echo "✅ .env already exists"
fi
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend
npm install --legacy-peer-deps
echo "✅ Frontend dependencies installed"
echo ""

echo "======================================"
echo "✅ Setup Complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Update backend/.env with your configuration:"
echo "   - MongoDB URI"
echo "   - Razorpay API keys"
echo ""
echo "2. Start Backend (in terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (in terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Seed Database (optional, for sample data):"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo "🌐 Access:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"
echo ""
echo "Happy Selling! 🎉"
