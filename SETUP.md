# 🚀 Job Application Tracker - Setup Guide

This guide will help you set up the Job Application Tracker on your local machine.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (free) - [Sign up here](https://www.mongodb.com/atlas)

## 🗂 Project Structure

```
job-application-tracker/
├── backend/          # Node.js Express API
├── frontend/         # React TypeScript App
├── README.md         # Main documentation
├── SETUP.md         # This setup guide
└── setup.js         # Automated setup script
```

## 🔧 Setup Instructions

### Method 1: Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-application-tracker
   ```

2. **Run the setup script**
   ```bash
   node setup.js
   ```
   
3. **Follow the prompts** to enter your MongoDB Atlas connection string

4. **Install dependencies and start servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm install
   npm run dev

   # Terminal 2: Frontend (open new terminal)
   cd frontend
   npm install
   npm run dev
   ```

### Method 2: Manual Setup

#### Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Create" and choose the free tier (M0)
   - Select your preferred region
   - Give your cluster a name (e.g., "job-tracker-cluster")

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `jobtracker`
   - Password: `jobtracker123` (or create your own secure password)
   - Set role to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** In production, restrict this to specific IP addresses

5. **Get Connection String**
   - Go back to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `job-tracker`

   Example connection string:
   ```
   mongodb+srv://jobtracker:jobtracker123@cluster0.example.mongodb.net/job-tracker?retryWrites=true&w=majority
   ```

#### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env file**
   Edit `backend/.env` with your values:
   ```env
   # Database Configuration
   MONGODB_URI=your-mongodb-atlas-connection-string-here

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
   JWT_EXPIRE=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL=http://localhost:8080
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Server is running on port 5000
   📊 Health check: http://localhost:5000/api/health
   🗄️ MongoDB Connected: cluster0-shard-00-00.example.mongodb.net
   ```

#### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Update frontend .env file**
   Edit `frontend/.env`:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5000/api

   # Application Configuration
   VITE_APP_NAME=Job Application Tracker
   VITE_APP_DESCRIPTION=Smart Career Progress Manager
   ```

5. **Start the frontend server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Local:   http://localhost:8080/
   Network: use --host to expose
   ```

## 🌐 Accessing the Application

1. **Open your browser** and go to `http://localhost:8080`
2. **Register a new account** or login with existing credentials
3. **Start tracking your job applications!**

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error connecting to MongoDB: MongoServerError: bad auth
```
**Solution:** Check your username and password in the MongoDB connection string.

#### Backend Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in `backend/.env` to a different number (e.g., 5001).

#### Frontend Build Errors
```
Module not found: Can't resolve '@/components/...'
```
**Solution:** Make sure you're in the `frontend` directory and run `npm install` again.

#### CORS Errors in Browser
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' blocked by CORS policy
```
**Solution:** Make sure the backend server is running and FRONTEND_URL in backend/.env matches your frontend URL.

### Verify Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return:
   ```json
   {
     "status": "OK",
     "message": "Job Tracker API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

2. **Frontend Access**
   - Open `http://localhost:8080`
   - You should see the login page

3. **Database Connection**
   - Check backend console for "MongoDB Connected" message
   - No error messages in backend logs

## 🚀 Production Deployment

For production deployment:

1. **Update environment variables**
   - Use strong, random JWT_SECRET
   - Set NODE_ENV=production
   - Configure proper CORS settings
   - Use environment-specific MongoDB database

2. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy using your preferred method**
   - Vercel/Netlify for frontend
   - Heroku/Railway/DigitalOcean for backend
   - Or any cloud provider of your choice

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main [README.md](README.md)
3. Check existing GitHub issues
4. Create a new issue with detailed error messages and steps to reproduce

---

**Happy coding!** 🎉