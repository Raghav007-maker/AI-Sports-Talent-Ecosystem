import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin, LoginCredentials } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const user = await apiLogin(credentials);
    if (user) {
      setCurrentUser(user);
    } else {
        throw new Error("Invalid credentials or role mismatch");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};