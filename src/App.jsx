// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LearnMore from './pages/LearnMore';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import LoginModal from './components/LoginModal';
import ConsultationFormModal from './components/ConsultationFormModal';
import { AdminProtectedRoute, ClientProtectedRoute } from './components/ProtectedRoutes';

// Create UI context directly in App
export const UIContext = React.createContext(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <UIContext.Provider value={{ showLogin, setShowLogin, showConsultationForm, setShowConsultationForm }}>
      <Router>
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
            <Route path="/admin-dashboard" element={
              <AdminProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/client-dashboard" element={
              <ClientProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                <ClientDashboard />
              </ClientProtectedRoute>
            } />
          </Routes>
          <Footer />
          {showLogin && 
            <LoginModal 
              setShowLoginModal={setShowLogin} 
              setIsLoggedIn={setIsLoggedIn}
              setIsAdmin={setIsAdmin}
            />
          }
          {showConsultationForm && <ConsultationFormModal setShowConsultationForm={setShowConsultationForm} />}
        </div>
      </Router>
    </UIContext.Provider>
  );
}

export default App;
