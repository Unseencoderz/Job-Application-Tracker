#!/bin/bash

echo "🚀 Job Application Tracker Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Create frontend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

cd ..

echo ""
echo "🔧 MongoDB Setup"
echo "================"

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Starting MongoDB..."
        mongod --fork --logpath /tmp/mongod.log
        if [ $? -eq 0 ]; then
            echo "✅ MongoDB started successfully"
        else
            echo "❌ Failed to start MongoDB. Please start it manually."
            echo "   You can start MongoDB with: mongod"
        fi
    fi
else
    echo "⚠️  MongoDB is not installed."
    echo "   Please install MongoDB:"
    echo "   - Ubuntu/Debian: sudo apt-get install mongodb"
    echo "   - macOS: brew install mongodb/brew/mongodb-community"
    echo "   - Windows: Download from https://www.mongodb.com/try/download/community"
    echo ""
    echo "   Or use MongoDB Atlas (cloud):"
    echo "   - Sign up at https://www.mongodb.com/atlas"
    echo "   - Create a free cluster"
    echo "   - Update the MONGODB_URI in backend/.env"
fi

echo ""
echo "🎯 Quick Start Commands"
echo "======================"
echo ""
echo "1. Start MongoDB (if not already running):"
echo "   mongod"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start the frontend server (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📝 Environment Configuration"
echo "=========================="
echo ""
echo "Backend (.env):"
echo "- MONGODB_URI: MongoDB connection string"
echo "- JWT_SECRET: Secret key for JWT tokens"
echo "- PORT: Backend server port (default: 5000)"
echo ""
echo "Frontend (.env):"
echo "- VITE_API_URL: Backend API URL (default: http://localhost:5000/api)"
echo ""
echo "🎉 Setup complete! Follow the quick start commands above to run the application."