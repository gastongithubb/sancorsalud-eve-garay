'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types/user';
import { findUserByToken, setUserToken, removeUserToken, generateToken, findUser } from '../utils/users';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = findUserByToken(token);
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setIsAdmin(user.isAdmin);
      } else {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = findUser(username, password);
      if (user) {
        const token = generateToken();
        setUserToken(user, token);
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUser(user);
        setIsAdmin(user.isAdmin);
        console.log('Token saved:', token); // Add this log
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error durante el inicio de sesión');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      removeUserToken(token);
    }
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    setError(null);
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token); // Add this log
    return token;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, isLoading, error, login, logout, updateUser, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};