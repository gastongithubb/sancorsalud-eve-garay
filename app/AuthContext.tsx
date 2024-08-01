'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  profilePicture: string;
  isAdmin: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('/team/none.webp');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.name);
        setProfilePicture(userData.profilePicture || '/team/none.webp');
        setIsAdmin(userData.isAdmin);
        setIsLoggedIn(true);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = (userData: any) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
    setProfilePicture(userData.profilePicture || '/team/none.webp');
    setIsAdmin(userData.isAdmin);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setProfilePicture('/team/none.webp');
    setIsAdmin(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, profilePicture, isAdmin, login, logout }}>
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