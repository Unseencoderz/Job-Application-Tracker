#!/bin/bash

echo "🚀 Setting up Job Tracker Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists."
fi

# Check MongoDB connection
echo "🗄️  Checking MongoDB connection..."

# Try to connect to MongoDB
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connection successful!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.log('❌ MongoDB connection failed:');
        console.log('   ' + error.message);
        console.log('');
        console.log('💡 To fix this:');
        console.log('   1. Install MongoDB locally, or');
        console.log('   2. Use MongoDB Atlas (recommended)');
        console.log('   3. Update MONGODB_URI in .env file');
        console.log('');
        console.log('📖 See README.md for detailed setup instructions.');
        process.exit(1);
    }
}

testConnection();
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the server: npm run dev"
    echo "2. Test the API: curl http://localhost:5000/api/health"
    echo "3. Open frontend: cd ../frontend && npm run dev"
else
    echo ""
    echo "⚠️  Setup completed with warnings."
    echo "Please fix the MongoDB connection issue before starting the server."
fi