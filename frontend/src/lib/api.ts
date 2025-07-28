import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  login: async (credentials: { login: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      removeAuthToken();
    }
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await api.get(`/auth/check-username/${username}`);
    return response.data;
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },

  verifyEmail: async (verificationData: {
    email: string;
    otp: string;
  }) => {
    const response = await api.post('/auth/verify-email', verificationData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  resendOTP: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  forgotPassword: async (login: string) => {
    const response = await api.post('/auth/forgot-password', { login });
    return response.data;
  },

  resetPassword: async (resetData: {
    token: string;
    newPassword: string;
  }) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  updateSkills: async (skills: string[]) => {
    const response = await api.put('/user/skills', { skills });
    return response.data;
  },

  updateJobPreferences: async (jobPreferences: any) => {
    const response = await api.put('/user/job-preferences', { jobPreferences });
    return response.data;
  },

  updateGoals: async (goals: any) => {
    const response = await api.put('/user/goals', { goals });
    return response.data;
  },

  updateAvatar: async (avatar: string) => {
    const response = await api.put('/user/avatar', { avatar });
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPublicProfile: async (username: string) => {
    const response = await api.get(`/user/${username}`);
    return response.data;
  },

  deleteAccount: async (password: string) => {
    const response = await api.delete('/user/account', { data: { password } });
    return response.data;
  },
};

// Applications API
export const applicationsAPI = {
  getApplications: async (params?: {
    status?: string;
    company?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getApplication: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  createApplication: async (applicationData: any) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  updateApplication: async (id: string, applicationData: any) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  },

  deleteApplication: async (id: string) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  archiveApplication: async (id: string, archived: boolean = true) => {
    const response = await api.patch(`/applications/${id}/archive`, { archived });
    return response.data;
  },

  // Task management
  addTask: async (id: string, taskData: any) => {
    const response = await api.post(`/applications/${id}/tasks`, taskData);
    return response.data;
  },

  updateTask: async (id: string, taskId: string, taskData: any) => {
    const response = await api.put(`/applications/${id}/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string, taskId: string) => {
    const response = await api.delete(`/applications/${id}/tasks/${taskId}`);
    return response.data;
  },

  // Timeline management
  addTimelineEvent: async (id: string, eventData: any) => {
    const response = await api.post(`/applications/${id}/timeline`, eventData);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  getWeeklyStats: async () => {
    const response = await api.get('/analytics/weekly');
    return response.data;
  },

  getPerformanceMetrics: async () => {
    const response = await api.get('/analytics/performance');
    return response.data;
  },

  getTasks: async () => {
    const response = await api.get('/analytics/tasks');
    return response.data;
  },

  getActivity: async (limit?: number) => {
    const response = await api.get('/analytics/activity', {
      params: limit ? { limit } : undefined,
    });
    return response.data;
  },
};

// Export utilities
export { getAuthToken, setAuthToken, removeAuthToken };
export default api;