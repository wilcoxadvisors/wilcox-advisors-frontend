// src/components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminProtectedRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

export function ClientProtectedRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}
