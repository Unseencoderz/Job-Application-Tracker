# 🚀 Job Application Tracker

**Smart Career Progress Manager** - A comprehensive web application that empowers job seekers to efficiently track, manage, and organize their job applications from a central, personalized dashboard.

![Job Application Tracker](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: JWT-based login/logout system
- **User Registration**: Account creation with email verification
- **Profile Management**: GitHub-style profile editing with avatar support
- **Unique Usernames**: Real-time username availability checking
- **Password Security**: Secure password hashing and validation

### 📊 Application Tracking
- **Comprehensive Status Tracking**: Applied, In Review, Interview, Technical Test, Offer, Rejected, Withdrawn, Ghosted
- **Advanced Filtering**: Filter by status, company, job type, and search functionality
- **Timeline Management**: Detailed timeline of application progress
- **Task Management**: Add and track application-related tasks with due dates
- **Notes & Attachments**: Rich notes and file attachments for each application

### 📈 Analytics & Insights
- **Performance Metrics**: Success rates, response times, and conversion analytics
- **Visual Dashboard**: Interactive charts and graphs for job search progress
- **Weekly/Monthly Stats**: Track application frequency and trends
- **Goal Setting**: Set and monitor daily/weekly application targets
- **Response Rate Analysis**: Track which sources and job types perform best

### 🎯 Smart Features
- **Real-time Updates**: Live data synchronization across devices
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme preferences with system detection
- **Search & Filter**: Advanced search across all application data
- **Export Functionality**: Export data as CSV/PDF for external use

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **ShadCN/UI** for beautiful, accessible components
- **React Hook Form** with Zod validation
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for cloud database
- **Mongoose** for elegant MongoDB object modeling
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation
- **CORS** and security middleware

### DevOps & Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git** for version control
- **Environment-based configuration**

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available)
- **Git** for cloning the repository

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-application-tracker
   ```

2. **Run automated setup** (Recommended)
   ```bash
   npm install
   npm run setup
   ```
   This will guide you through setting up MongoDB Atlas and environment variables.

3. **Install all dependencies**
   ```bash
   npm run install:all
   ```

4. **Start both servers** (backend + frontend)
   ```bash
   npm run dev
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1: Backend
   npm run dev:backend

   # Terminal 2: Frontend (new terminal)
   npm run dev:frontend
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to see the application.

### Alternative: Manual Setup

For detailed manual setup instructions, see [SETUP.md](SETUP.md).

## 📦 Installation

### Backend Setup

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

4. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
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
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select your preferred region

3. **Configure Database Access**
   - Create a database user
   - Set up IP whitelist (or allow access from anywhere for development)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace the placeholder values

## 📖 Usage

### Creating Your First Application

1. **Register/Login** to your account
2. **Click "Add Application"** on the dashboard
3. **Fill in the details**:
   - Job title and company name
   - Application date
   - Job URL (optional)
   - Initial status
   - Notes
4. **Save** the application

### Managing Applications

- **View All Applications**: See all your applications in a grid layout
- **Filter & Search**: Use the search bar and status filters
- **Update Status**: Click on an application to change its status
- **Add Tasks**: Create follow-up tasks with due dates
- **View Timeline**: Track the complete history of each application

### Analytics Dashboard

- **Overview Stats**: See total applications, success rates, and response times
- **Performance Metrics**: Analyze which job types and sources work best
- **Goal Tracking**: Monitor your daily and weekly application targets
- **Trends**: View application patterns over time

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
POST /api/auth/logout       # Logout user
GET  /api/auth/me          # Get current user
```

### Application Endpoints

```
GET    /api/applications           # Get user applications
POST   /api/applications           # Create new application
GET    /api/applications/:id       # Get specific application
PUT    /api/applications/:id       # Update application
DELETE /api/applications/:id       # Delete application
```

### User Profile Endpoints

```
GET /api/user/profile              # Get user profile
PUT /api/user/profile              # Update user profile
PUT /api/user/skills               # Update user skills
PUT /api/user/goals                # Update user goals
```

### Analytics Endpoints

```
GET /api/analytics/overview        # Get analytics overview
GET /api/analytics/performance     # Get performance metrics
GET /api/analytics/weekly          # Get weekly stats
```

## 🏗 Project Structure

```
job-application-tracker/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utility libraries
│   │   └── App.tsx         # Main app component
│   ├── public/
│   └── package.json
└── README.md
```

## 🤝 Contributing

We welcome contributions to the Job Application Tracker! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ShadCN/UI** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB Atlas** for the cloud database solution
- **Vercel** for deployment and hosting capabilities

## 📞 Support

If you have any questions or need help getting started:

- **Create an Issue** on GitHub
- **Check the Documentation** for common solutions
- **Review Existing Issues** for similar problems

## 🗺 Roadmap

### Upcoming Features

- [ ] **Browser Extension** for auto-tracking applications
- [ ] **AI-Powered Insights** for application optimization
- [ ] **Email Integration** for automatic status updates
- [ ] **Mobile App** (React Native)
- [ ] **Team Collaboration** features
- [ ] **Advanced Analytics** with predictive modeling

---

**Happy Job Hunting!** 🎯

*Made with ❤️ for job seekers everywhere*