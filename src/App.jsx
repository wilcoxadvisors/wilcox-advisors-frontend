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

  React.useEffect(() => {
    console.log('App.jsx - showConsultationForm changed to:', showConsultationForm);
  }, [showConsultationForm]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <Route path="/" element={<Home setShowConsultationForm={setShowConsultationForm} />} /> {/* Pass setter */}
        <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/client-dashboard" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
      </Routes>
      {showLogin && <LoginModal setShowLoginModal={setShowLogin} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />}
      {showConsultationForm && <ConsultationFormModal />}
      <Footer />
    </div>
  );
}
