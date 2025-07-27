# Job Tracker Backend API

A Node.js/Express backend API for the Job Tracker application with MongoDB database.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Set up MongoDB**

   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB locally
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb-community
   
   # Start MongoDB
   sudo systemctl start mongodb
   ```

   **Option B: MongoDB Atlas (Recommended)**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env` file

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Application.js   # Job application model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── user.js          # User management routes
│   │   ├── applications.js  # Job application routes
│   │   └── analytics.js     # Analytics routes
│   ├── utils/
│   │   └── generateToken.js # JWT token utilities
│   └── index.js             # Main server file
├── .env                     # Environment variables
├── .env.example            # Example environment file
└── package.json            # Dependencies and scripts
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/job-tracker` |
| `JWT_SECRET` | JWT signing secret | `dev-secret-key-change-in-production` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/profile` - Delete user account

### Job Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/applications` - Get application analytics
- `GET /api/analytics/status` - Get status distribution

## 🔍 Troubleshooting

### MongoDB Connection Issues

1. **Local MongoDB not running**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongodb
   
   # Start MongoDB
   sudo systemctl start mongodb
   ```

2. **MongoDB Atlas connection issues**
   - Verify your connection string
   - Check IP whitelist in Atlas
   - Ensure username/password are correct

3. **Network issues**
   - Check firewall settings
   - Verify internet connection
   - Try different network

### Common Errors

1. **"Cannot find package" errors**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port already in use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

3. **JWT errors**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Health check
curl http://localhost:5000/api/health
```

## 📝 Development

### Adding New Routes

1. Create route file in `src/routes/`
2. Import in `src/index.js`
3. Add middleware if needed
4. Test the endpoint

### Adding New Models

1. Create model file in `src/models/`
2. Define schema with validation
3. Add indexes for performance
4. Export the model

### Database Migrations

For schema changes, consider using a migration tool or manually update the database schema.

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure MongoDB Atlas
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-tracker
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://yourdomain.com
```

## 📄 License

This project is licensed under the ISC License.