#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  console.log('🚀 Job Application Tracker Setup');
  console.log('=====================================\n');

  // Backend setup
  console.log('📊 Backend Configuration:');
  
  const mongoUri = await prompt('Enter your MongoDB Atlas connection string: ');
  const jwtSecret = await prompt('Enter a JWT secret (or press Enter for auto-generated): ') || 
    `jwt-secret-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  const backendEnv = `# Database Configuration
MONGODB_URI=${mongoUri}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:8080

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret`;

  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
  console.log('✅ Backend .env file created');

  // Frontend setup
  const frontendEnv = `# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=Job Application Tracker
VITE_APP_DESCRIPTION=Smart Career Progress Manager`;

  fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
  console.log('✅ Frontend .env file created');

  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. cd backend && npm install && npm run dev');
  console.log('2. cd frontend && npm install && npm run dev (in a new terminal)');
  console.log('3. Open http://localhost:8080 in your browser');

  rl.close();
}

setup().catch(console.error);