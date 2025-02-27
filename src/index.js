import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Home page component
import LearnMore from './pages/LearnMore'; // Learn More page component
import AdminDashboard from './components/AdminDashboard'; // Admin dashboard component
import ClientDashboard from './components/ClientDashboard'; // Client dashboard component
import { AdminProtectedRoute, ClientProtectedRoute } from './components/ProtectedRoutes'; // Protected route components
import Header from './components/Header'; // Header component
import Footer from './components/Footer'; // Footer component
import './index.css'; // Global styles (assumed to exist)

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header /> {/* Header appears on every page */}
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home />} />
        
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
      <Footer /> {/* Footer appears on every page */}
    </Router>
  </React.StrictMode>,
  document.getElementById('root') // Renders the app into the DOM element with id="root" in index.html
);
