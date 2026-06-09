#!/bin/bash

echo "🚀 Akshaygun E-Commerce Setup"
echo "================================"
echo ""

# Backend Setup
echo "📦 Setting up backend..."
cd backend
npm install

echo ""
echo "⚙️ Creating .env file for backend..."
echo "Please edit backend/.env with your configuration:"
echo "- MONGODB_URI"
echo "- RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET"
echo ""

cp .env.example .env

cd ..

# Frontend Setup
echo "📦 Setting up frontend..."
cd frontend
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API at: http://localhost:5000"
