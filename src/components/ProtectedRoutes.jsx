import { Navigate } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!token || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

function ClientProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!token || isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
}

export { AdminProtectedRoute, ClientProtectedRoute };
