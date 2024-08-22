'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types/user';
import { findUserByToken, setUserToken, removeUserToken, generateToken, findUser } from '@/utils/users';

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

  const saveSessionToLocalStorage = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const clearSessionFromLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedToken && storedUser && storedIsLoggedIn === 'true') {
      const parsedUser: User = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin);
    } else {
      clearSessionFromLocalStorage();
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
        saveSessionToLocalStorage(token, user);
        setIsLoggedIn(true);
        setUser(user);
        setIsAdmin(user.isAdmin);
        console.log('Session saved to localStorage');
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
    clearSessionFromLocalStorage();
    console.log('Session cleared from localStorage');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        saveSessionToLocalStorage(token, updatedUser);
        console.log('Updated user saved to localStorage');
      }
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
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