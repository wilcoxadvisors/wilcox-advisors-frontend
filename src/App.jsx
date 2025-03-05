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
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';

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
        setShowLogin={setShowLogin}
        setShowConsultationForm={setShowConsultationForm}
      />

      <Routes>
        <Route path="/" element={<Home setShowConsultationForm={setShowConsultationForm} />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/client-dashboard"
          element={
            <ClientProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
              <ClientDashboard />
            </ClientProtectedRoute>
          }
        />
      </Routes>

      {showLogin && <LoginModal />}
      {showConsultationForm && <ConsultationFormModal />}

      <Footer />
    </div>
  );
}

// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  const login = (token, adminStatus) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', adminStatus);
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// src/contexts/UIContext.js
import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  return (
    <UIContext.Provider value={{ showLogin, setShowLogin, showConsultationForm, setShowConsultationForm }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
