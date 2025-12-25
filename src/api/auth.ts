import type { AuthResponse, LoginCredentials, User } from '../types';
import apiClient from './client';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TEMPORARY: Demo login for testing (remove when backend is ready)
    if (credentials.email === 'demo@ad.com' && credentials.password === 'demo123') {
      return {
        token: 'demo-token-12345',
        user: {
          id: 1,
          email: 'demo@ad.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'Admin',
        },
      };
    }

    // Real backend call (uncomment when ready)
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};
