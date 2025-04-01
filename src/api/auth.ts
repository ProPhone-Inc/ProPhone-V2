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
        // Use fetch directly to avoid axios interceptors
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Invalid credentials' }));
          throw new Error(errorData.error || 'Invalid credentials');
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        if (error.response?.status === 401 || error.message.includes('credentials')) {
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
      // Use fetch directly to avoid axios interceptors
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to get profile');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async updateProfile(updates: Partial<RegisterData>) {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
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