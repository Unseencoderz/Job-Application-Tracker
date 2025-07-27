# Job Application Tracker

A full-stack application for tracking job applications with analytics and progress management.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/job-tracker
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   The frontend environment is already configured, but you can modify it if needed:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5000/api
   
   # Application Configuration
   VITE_APP_NAME=Job Application Tracker
   VITE_APP_DESCRIPTION=Smart Career Progress Manager
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Application.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   ├── applications.js
│   │   │   └── analytics.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── lib/
│   │   └── hooks/
│   ├── package.json
│   └── .env
└── README.md
```

## 🔧 Backend Dependencies

### Production Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variables
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Input validation

### Development Dependencies
- `nodemon` - Auto-restart on file changes
- `jest` - Testing framework
- `@types/jest` - TypeScript definitions for Jest

## 🎨 Frontend Dependencies

### Core Dependencies
- `react` & `react-dom` - React framework
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client
- `zustand` - State management

### UI Dependencies
- `@radix-ui/*` - Headless UI components
- `lucide-react` - Icons
- `tailwindcss` - Utility-first CSS
- `class-variance-authority` - Component variants
- `clsx` & `tailwind-merge` - Class utilities

### Development Dependencies
- `vite` - Build tool
- `typescript` - Type safety
- `eslint` - Code linting
- `@vitejs/plugin-react-swc` - React plugin for Vite

## 🗄️ Database Schema

### User Model
- Authentication (username, email, password)
- Profile information (name, bio, skills, experience)
- Job preferences and goals
- Notification settings

### Application Model
- Job details (title, company, description)
- Application status tracking
- Timeline events
- Tasks and follow-ups
- Salary and benefits information

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration:** Users can create accounts with username, email, and password
2. **Login:** Users can login with username/email and password
3. **Token Management:** JWT tokens are stored in localStorage and automatically included in API requests
4. **Protected Routes:** Frontend routes are protected based on authentication status

## 📊 Features

### User Management
- User registration and login
- Profile management
- Password updates
- Account settings

### Application Tracking
- Add new job applications
- Update application status
- Track application timeline
- Add notes and follow-ups

### Analytics
- Application statistics
- Success rate tracking
- Progress visualization
- Goal setting and monitoring

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your preferred platform
3. Ensure environment variables are properly configured

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run lint
```

## 🔧 Development

### Backend Development
- Uses nodemon for auto-restart
- MongoDB connection with error handling
- Comprehensive error middleware
- Input validation with express-validator

### Frontend Development
- Hot module replacement with Vite
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/status` - Get status breakdown
- `GET /api/analytics/timeline` - Get timeline data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
