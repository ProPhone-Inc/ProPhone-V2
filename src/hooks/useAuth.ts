import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  showAds?: boolean;
  originalUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
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
          setUser(parsedUser);
          setIsAuthenticated(true);
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
  
  // const handleLogin = (userData: User) => {
  //   setUser(userData);
  //   setIsAuthenticated(true);
  //   localStorage.setItem('auth_user', JSON.stringify(userData));
  // };

  // useEffect(() => {
  //   const savedUser = localStorage.getItem('auth_user');
  //   if (savedUser) {
  //     handleLogin(JSON.parse(savedUser));
  //   }
  // }, []);

  const login = handleLogin;
  // const login = async (credentials: { email: string; password: string }) => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     // Special case for owner login
  //     if (credentials.email === 'dallas@prophone.io' && credentials.password === 'owner') {
  //       const ownerData = {
  //         id: '0',
  //         name: 'Dallas Reynolds',
  //         email: 'dallas@prophone.io',
  //         role: 'owner',
  //         avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
  //       };
  //       await handleLogin(ownerData);
  //       return;
  //     }

  //     const response = await fetch('http://localhost:3000/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(credentials)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Invalid credentials');
  //     }

  //     const { user, token } = await response.json();
  //     localStorage.setItem('auth_token', token);
  //     await handleLogin(user);
      
  //   } catch (error) {
  //     const errorMessage = error instanceof Error 
  //       ? error.message 
  //       : 'Login failed. Please try again.';
  //     setError(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const login = async (credentials: { email: string; password: string }) => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const { user: userData, token } = await auth.login(credentials);
      
  //     if (!userData || !token) {
  //       throw new Error('Invalid response from server');
  //     }

  //     localStorage.setItem('auth_token', token);
  //     await handleLogin(userData);
      
  //   } catch (error) {
  //     const errorMessage = error instanceof Error 
  //       ? error.message 
  //       : 'Login failed. Please try again.';
  //     setError(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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