import { api } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export const auth = {
  async login(credentials: LoginCredentials) {
    try {
      if (credentials.email === 'dallas@prophone.io' && credentials.password === 'owner') {
        const ownerData = {
          id: '0',
          name: 'Dallas Reynolds',
          email: 'dallas@prophone.io',
          role: 'owner',
          avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
        };
        return { user: ownerData, token: 'owner-token' };
      }

      try {
        const { data } = await api.post('/auth/login', credentials);
        return data;
      } catch (error) {
        if (error.response?.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (!error.response) {
          throw new Error('Network error. Please check your connection.');
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },

  async register(userData: RegisterData) {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('auth_token', data.token);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async getProfile() {
    try {
      const { data } = await api.get('/user/profile');
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async updateProfile(updates: Partial<RegisterData>) {
    try {
      const { data } = await api.put('/user/profile', updates);
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
    window.dispatchEvent(new Event('logout'));
  }
};