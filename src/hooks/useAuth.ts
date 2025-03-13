import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authCheckComplete = React.useRef<boolean>(false);

  const handleLogin = async (userData: User) => {
    document.body.classList.remove('modal-open');
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  useEffect(() => {
    if (authCheckComplete.current) return;
    
    const initAuth = async () => {
      setIsLoading(true);
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          await handleLogin(parsedUser);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          setError('Failed to restore session');
        }
      }
      authCheckComplete.current = true;
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Special case for owner login
      if (credentials.email === 'dallas@prophone.io' && credentials.password === 'owner') {
        const ownerData = {
          id: '0',
          name: 'Dallas Reynolds',
          email: 'dallas@prophone.io',
          role: 'owner',
          avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
        };
        await handleLogin(ownerData);
        return;
      }

      // For demo purposes, simulate successful login
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'user',
        plan: 'starter'
      };
      
      await handleLogin(mockUser);
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    auth.logout();
    document.body.classList.remove('modal-open');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setIsLoading(false);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}