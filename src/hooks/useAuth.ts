import React, { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const ownerAccount = {
    id: '0',
    name: 'Dallas Reynolds',
    email: 'dallas@prophone.io',
    role: 'owner',
    avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      handleLogin(JSON.parse(savedUser));
    }
  }, []);

  const login = handleLogin;

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
    window.location.href = '/';
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
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