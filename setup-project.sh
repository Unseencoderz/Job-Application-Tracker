#!/bin/bash

echo "🚀 Setting up Job Tracker Project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm version: $(npm --version)"

# Backend Setup
print_status "Setting up Backend..."

cd backend

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from .env.example..."
    cp .env.example .env
    print_success ".env file created. Please edit it with your MongoDB configuration."
else
    print_success ".env file already exists."
fi

# Test backend setup
print_status "Testing backend setup..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

async function testBackend() {
    try {
        console.log('Testing backend dependencies...');
        require('express');
        require('cors');
        require('helmet');
        require('express-rate-limit');
        require('dotenv');
        require('mongoose');
        require('express-validator');
        require('bcryptjs');
        require('jsonwebtoken');
        console.log('✅ All backend dependencies are available');
        
        // Test MongoDB connection
        console.log('Testing MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connection successful!');
        await mongoose.connection.close();
        
    } catch (error) {
        console.log('❌ Backend setup issue:');
        console.log('   ' + error.message);
        console.log('');
        console.log('💡 To fix MongoDB connection:');
        console.log('   1. Install MongoDB locally, or');
        console.log('   2. Use MongoDB Atlas (recommended)');
        console.log('   3. Update MONGODB_URI in .env file');
        console.log('');
        console.log('📖 See backend/README.md for detailed setup instructions.');
        process.exit(1);
    }
}

testBackend();
"

BACKEND_STATUS=$?

cd ..

# Frontend Setup
print_status "Setting up Frontend..."

cd frontend

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    print_success "Frontend .env file created."
else
    print_success "Frontend .env file already exists."
fi

# Test frontend setup
print_status "Testing frontend setup..."
node -e "
try {
    console.log('Testing frontend dependencies...');
    require('react');
    require('react-dom');
    require('@tanstack/react-query');
    require('axios');
    require('zustand');
    require('react-router-dom');
    console.log('✅ All frontend dependencies are available');
} catch (error) {
    console.log('❌ Frontend setup issue:');
    console.log('   ' + error.message);
    process.exit(1);
}
"

FRONTEND_STATUS=$?

cd ..

# Summary
echo ""
echo "=========================================="
echo "🎉 Project Setup Summary"
echo "=========================================="

if [ $BACKEND_STATUS -eq 0 ]; then
    print_success "Backend: ✅ Ready"
else
    print_warning "Backend: ⚠️  Needs MongoDB setup"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    print_success "Frontend: ✅ Ready"
else
    print_error "Frontend: ❌ Setup failed"
fi

echo ""
echo "📋 Next Steps:"
echo ""

if [ $BACKEND_STATUS -eq 0 ]; then
    echo "1. Start backend: cd backend && npm run dev"
    echo "2. Start frontend: cd frontend && npm run dev"
    echo "3. Test backend: curl http://localhost:5000/api/health"
    echo "4. Open frontend: http://localhost:5173"
else
    echo "1. Set up MongoDB (see backend/README.md)"
    echo "2. Update MONGODB_URI in backend/.env"
    echo "3. Run: cd backend && ./setup.sh"
    echo "4. Start backend: cd backend && npm run dev"
    echo "5. Start frontend: cd frontend && npm run dev"
fi

echo ""
echo "📖 Documentation:"
echo "- Backend: backend/README.md"
echo "- Frontend: frontend/README.md"
echo "- Main: README.md"

echo ""
echo "🔧 Troubleshooting:"
echo "- Backend issues: Check backend/README.md"
echo "- Frontend issues: Check frontend/README.md"
echo "- MongoDB issues: See MongoDB Atlas setup guide"

echo ""
print_success "Setup completed! 🚀"