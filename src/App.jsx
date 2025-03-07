// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import LearnMore from './pages/LearnMore';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { AdminProtectedRoute, ClientProtectedRoute } from './components/ProtectedRoutes';
import LoginModal from './components/LoginModal';
import ConsultationFormModal from './components/ConsultationFormModal';
import MainContent from './components/MainContent';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <MainContent />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
