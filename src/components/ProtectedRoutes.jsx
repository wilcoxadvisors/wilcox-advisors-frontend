// src/components/ProtectedRoutes.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminProtectedRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

function ClientProtectedRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn || isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

export { AdminProtectedRoute, ClientProtectedRoute };
