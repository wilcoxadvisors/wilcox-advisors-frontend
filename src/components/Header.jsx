// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 
import { useUI } from '../contexts/UIContext';

function Header({ isLoggedIn, isAdmin, handleLogout, setShowLogin, setShowConsultationForm }) {
  // Get context values but fallback to props for safety
  const authContext = useAuth();
  const uiContext = useUI();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use context values if available, otherwise fall back to props
  const auth = {
    isLoggedIn: authContext?.isLoggedIn !== undefined ? authContext.isLoggedIn : isLoggedIn,
    isAdmin: authContext?.isAdmin !== undefined ? authContext.isAdmin : isAdmin,
    logout: authContext?.logout || handleLogout
  };
  
  const ui = {
    setShowLogin: uiContext?.setShowLogin || setShowLogin,
    setShowConsultationForm: uiContext?.setShowConsultationForm || setShowConsultationForm
  };

  const handleSectionClick = (section) => {
    if (window.location.pathname === '/') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${section}`;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl text-blue-800 font-bold hover:text-blue-900 transition duration-200" aria-label="Home">
              WILCOX ADVISORS
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleSectionClick('services')} 
              className="text-gray-700 hover:text-blue-800 font-medium" 
              aria-label="Services section"
            >
              Services
            </button>
            <button 
              onClick={() => handleSectionClick('blog')} 
              className="text-gray-700 hover:text-blue-800 font-medium" 
              aria-label="Blog section"
            >
              Blog
            </button>
            <button 
              onClick={() => handleSectionClick('about')} 
              className="text-gray-700 hover:text-blue-800 font-medium" 
              aria-label="About section"
            >
              About
            </button>
            <button 
              onClick={() => handleSectionClick('contact')} 
              className="text-gray-700 hover:text-blue-800 font-medium" 
              aria-label="Contact section"
            >
              Contact
            </button>
            {auth.isLoggedIn ? (
              <>
                <Link 
                  to={auth.isAdmin ? '/admin-dashboard' : '/client-dashboard'} 
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition duration-200" 
                  aria-label={auth.isAdmin ? "Admin Dashboard" : "Client Dashboard"}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={auth.logout} 
                  className="text-gray-700 hover:text-blue-800 font-medium" 
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => ui.setShowLogin(true)} 
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition duration-200" 
                aria-label="Login"
              >
                Login
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-700 hover:text-blue-800" 
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white" role="menu">
              <button 
                onClick={() => handleSectionClick('services')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800 w-full text-left" 
                aria-label="Services section"
              >
                Services
              </button>
              <button 
                onClick={() => handleSectionClick('blog')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800 w-full text-left" 
                aria-label="Blog section"
              >
                Blog
              </button>
              <button 
                onClick={() => handleSectionClick('about')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800 w-full text-left" 
                aria-label="About section"
              >
                About
              </button>
              <button 
                onClick={() => handleSectionClick('contact')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800 w-full text-left" 
                aria-label="Contact section"
              >
                Contact
              </button>
              {auth.isLoggedIn ? (
                <>
                  <Link 
                    to={auth.isAdmin ? '/admin-dashboard' : '/client-dashboard'} 
                    className="block px-3 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 w-full text-left" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    aria-label={auth.isAdmin ? "Admin Dashboard" : "Client Dashboard"}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { auth.logout(); setIsMobileMenuOpen(false); }} 
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800" 
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { ui.setShowLogin(true); setIsMobileMenuOpen(false); }} 
                  className="block px-3 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 w-full text-left"
                  aria-label="Login"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
