// src/components/ProtectedRoutes.jsx
import { Navigate } from 'react-router-dom';

function AdminProtectedRoute({ children, isLoggedIn, isAdmin }) {
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

function ClientProtectedRoute({ children, isLoggedIn, isAdmin }) {
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}

export { AdminProtectedRoute, ClientProtectedRoute };
