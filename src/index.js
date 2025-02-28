import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Home page component
import LearnMore from './pages/LearnMore'; // Learn More page component
import AdminDashboard from './components/AdminDashboard'; // Admin dashboard component
import ClientDashboard from './components/ClientDashboard'; // Client dashboard component
import { AdminProtectedRoute, ClientProtectedRoute } from './components/ProtectedRoutes'; // Protected route components
import Header from './components/Header'; // Header component
import Footer from './components/Footer'; // Footer component
import ConsultationFormModal from './components/ConsultationFormModal'; // Consultation form modal component
import LoginModal from './components/LoginModal'; // Login modal component
import './index.css'; // Global styles (assumed to exist)

// Wrapper component to manage modal states
function App() {
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Router>
      {/* Pass both modal setters to Header for triggering the modals */}
      <Header 
        setShowConsultationForm={setShowConsultationForm} 
        setShowLoginModal={setShowLoginModal} 
      />
      <Routes>
        {/* Home page route with consultation form trigger */}
        <Route
          path="/"
          element={<Home setShowConsultationForm={setShowConsultationForm} />}
        />
        {/* Learn More page route */}
        <Route path="/learn-more" element={<LearnMore />} />
        {/* Protected Admin Dashboard route */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        {/* Protected Client Dashboard route */}
        <Route
          path="/client-dashboard"
          element={
            <ClientProtectedRoute>
              <ClientDashboard />
            </ClientProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      {/* Render the modals conditionally */}
      {showConsultationForm && (
        <ConsultationFormModal setShowConsultationForm={setShowConsultationForm} />
      )}
      {showLoginModal && (
        <LoginModal setShowLoginModal={setShowLoginModal} />
      )}
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Renders the app into the DOM element with id="root" in index.html
);
