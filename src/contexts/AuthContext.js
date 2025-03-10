// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isLoggedIn]);

  const login = (token, admin) => {
    console.log("Login called with:", { token: !!token, admin });
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', admin);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };

  const logout = async () => {
    console.log("Logout function called in AuthContext");
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    
    // Optional: call logout endpoint if you have one
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://wilcox-advisors-backend.onrender.com';
      await axios.post(`${API_URL}/api/auth/logout`);
    } catch (error) {
      console.log("Backend logout failed, but local state cleared");
    }
    
    return Promise.resolve(); // Ensure we return a resolved promise
  };

  const value = {
    isLoggedIn,
    isAdmin,
    user,
    login,
    logout
  };

  console.log("AuthContext state:", { isLoggedIn, isAdmin });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
