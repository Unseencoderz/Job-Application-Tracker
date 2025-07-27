# ⚡ Quick Start Guide

Get the Job Application Tracker running in 5 minutes!

## 🎯 What You Need

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/atlas)

## 🚀 Setup Steps

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd job-application-tracker
npm install
```

### 2. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account & cluster
3. Add database user: `jobtracker` / `jobtracker123`
4. Allow network access (0.0.0.0/0 for development)
5. Get connection string

### 3. Configure Environment
```bash
# Create backend/.env
MONGODB_URI=mongodb+srv://jobtracker:jobtracker123@cluster0.xxxxx.mongodb.net/job-tracker
JWT_SECRET=your-random-secret-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Create frontend/.env  
VITE_API_URL=http://localhost:5000/api
```

### 4. Install & Run
```bash
# Install dependencies
npm run install:all

# Start both servers
npm run dev
```

### 5. Access Application
Open `http://localhost:8080` in your browser!

## 🔧 Alternative Commands

```bash
# Install dependencies separately
cd backend && npm install
cd ../frontend && npm install

# Run servers separately  
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

## 🚨 Troubleshooting

**MongoDB Connection Error?**
- Check your connection string format
- Ensure username/password are correct
- Verify network access is allowed

**Port 5000 in use?**
- Change PORT in backend/.env to 5001
- Update VITE_API_URL in frontend/.env

**CORS errors?**
- Ensure backend is running
- Check FRONTEND_URL in backend/.env

## 📋 Project Status Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas cluster created  
- [ ] Database user created
- [ ] Network access configured
- [ ] backend/.env file created
- [ ] frontend/.env file created
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Backend running (`npm run dev:backend`)
- [ ] Frontend running (`npm run dev:frontend`)
- [ ] Application accessible at localhost:8080

## 🎉 You're Done!

The application should now be running with:
- ✅ Backend API at `http://localhost:5000`
- ✅ Frontend app at `http://localhost:8080`
- ✅ MongoDB Atlas connected
- ✅ Authentication working
- ✅ Job application tracking ready

**Need more help?** Check [SETUP.md](SETUP.md) for detailed instructions.