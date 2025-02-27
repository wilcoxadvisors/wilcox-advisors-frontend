import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import LoginModal from './LoginModal';
import ConsultationFormModal from './ConsultationFormModal';
import { AdminProtectedRoute, ClientProtectedRoute } from './ProtectedRoutes';

export default function App() {
  const navigate = useNavigate();

  // State for authentication and modals
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header component */}
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin}
        setShowConsultationForm={setShowConsultationForm}
      />

      {/* Define routes */}
      <Routes>
        <Route path="/" element={<Home setShowConsultationForm={setShowConsultationForm} />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/client-dashboard"
          element={
            <ClientProtectedRoute>
              <ClientDashboard />
            </ClientProtectedRoute>
          }
        />
        {/* Existing route for learn-more can be added here if needed */}
      </Routes>

      {/* Modals rendered conditionally */}
      {showLogin && (
        <LoginModal
          setShowLogin={setShowLogin}
          setIsLoggedIn={setIsLoggedIn}
          setIsAdmin={setIsAdmin}
        />
      )}
      {showConsultationForm && (
        <ConsultationFormModal setShowConsultationForm={setShowConsultationForm} />
      )}

      {/* Footer component */}
      <Footer />
    </div>
  );
}
