// src/App.jsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import LoginModal from './components/LoginModal';
import ConsultationFormModal from './components/ConsultationFormModal';
import { AdminProtectedRoute, ClientProtectedRoute } from './components/ProtectedRoutes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UIProvider, useUI } from './contexts/UIContext';
import LearnMore from './pages/LearnMore';
import axios from 'axios';

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { showLogin, setShowLogin, showConsultationForm, setShowConsultationForm } = useUI();

  const handleLogout = async () => {
    try {
      // No need to call the backend for logout in token-based auth
      // Just clear the local storage
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLogin}
      />
      <Routes>
        <Route path="/" element={<Home setShowConsultationForm={setShowConsultationForm} />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/client-dashboard" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
      </Routes>
      {showLogin && <LoginModal setShowLoginModal={setShowLogin} setIsLoggedIn={() => {}} setIsAdmin={() => {}} />}
      {showConsultationForm && <ConsultationFormModal setShowConsultationForm={setShowConsultationForm} />}
      <Footer />
    </div>
  );
}
