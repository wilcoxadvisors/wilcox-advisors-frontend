// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { setShowLoginModal, setShowConsultationForm } = useUI();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-blue-800 font-bold text-2xl">
          Wilcox Advisors
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-800">
            Home
          </Link>
          <Link to="/learn-more" className="text-gray-700 hover:text-blue-800">
            Learn More
          </Link>
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-800">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/client-dashboard" className="text-gray-700 hover:text-blue-800">
                  Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-gray-700 hover:text-blue-800"
              >
                Login
              </button>
              <button
                onClick={() => setShowConsultationForm(true)}
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200"
              >
                Free Consultation
              </button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-40">
            <div className="flex flex-col p-4">
              <Link 
                to="/" 
                className="py-2 text-gray-700 hover:text-blue-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/learn-more" 
                className="py-2 text-gray-700 hover:text-blue-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Learn More
              </Link>
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link 
                      to="/admin-dashboard" 
                      className="py-2 text-gray-700 hover:text-blue-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/client-dashboard" 
                      className="py-2 text-gray-700 hover:text-blue-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="py-2 text-left text-gray-700 hover:text-blue-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="py-2 text-left text-gray-700 hover:text-blue-800"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowConsultationForm(true);
                      setIsMenuOpen(false);
                    }}
                    className="mt-2 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition duration-200"
                  >
                    Free Consultation
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
