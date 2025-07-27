import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI, getAuthToken } from '@/lib/api';

interface User {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    resumeUrl?: string;
    skills: string[];
    experience: string;
    jobPreferences: {
      jobTypes: string[];
      workMode: string[];
      preferredRoles: string[];
      salaryExpectation: {
        min?: number;
        max?: number;
        currency: string;
      };
    };
    goals: {
      dailyApplicationTarget: number;
      weeklyApplicationTarget: number;
      targetRole?: string;
      targetCompanies: string[];
    };
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    reminderFrequency: string;
    theme: string;
  };
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: { login: string; password: string }) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.login(credentials);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.register(userData);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed',
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          await authAPI.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Even if logout request fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.me(); // Reload user data after update
          
          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Profile update failed',
          });
          throw error;
        }
      },

      loadUser: async () => {
        const token = getAuthToken();
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.me();
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't show error for token expiry
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth state on app load
export const initializeAuth = async () => {
  const { loadUser } = useAuthStore.getState();
  await loadUser();
};