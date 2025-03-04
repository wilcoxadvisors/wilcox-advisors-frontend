import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header({ isLoggedIn, isAdmin, handleLogout, setShowLogin, setShowLoginModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const openLoginModal = () => {
    if (typeof setShowLogin === 'function') {
      setShowLogin(true);
    } else if (typeof setShowLoginModal === 'function') {
      setShowLoginModal(true);
    }
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
    <nav className="bg-white shadow-lg sticky top-0 z-50" role="navigation" aria-label="Main navigation">
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
              className="text-gray-700 hover:text-blue-800" 
              aria-label="Services section"
              data-tooltip="View our accounting services, including manual data entry for GL and budgets"
            >
              Services
            </button>
            <button 
              onClick={() => handleSectionClick('blog')} 
              className="text-gray-700 hover:text-blue-800" 
              aria-label="Blog section"
              data-tooltip="Read our latest blog posts on cash flow management"
            >
              Blog
            </button>
            <button 
              onClick={() => handleSectionClick('about')} 
              className="text-gray-700 hover:text-blue-800" 
              aria-label="About section"
              data-tooltip="Learn about Wilcox Advisors’ scalable accounting solutions"
            >
              About
            </button>
            <button 
              onClick={() => handleSectionClick('contact')} 
              className="text-gray-700 hover:text-blue-800" 
              aria-label="Contact section"
              data-tooltip="Contact us for support on manual entries"
            >
              Contact
            </button>
            {isLoggedIn ? (
              <>
                <Link 
                  to={isAdmin ? '/admin-dashboard' : '/client-dashboard'} 
                  className="text-gray-700 hover:text-blue-800" 
                  aria-label={isAdmin ? "Admin Dashboard" : "Client Dashboard"}
                  data-tooltip="Access your dashboard for manual financial data"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-blue-800" 
                  aria-label="Logout"
                  data-tooltip="Log out of your secure account"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={openLoginModal} 
                className="text-gray-700 hover:text-blue-800" 
                aria-label="Login"
                data-tooltip="Login with secure authentication (MFA coming soon)"
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
                className="block px-3 py-2 text-gray-700 hover:text-blue-800" 
                aria-label="Services section"
              >
                Services
              </button>
              <button 
                onClick={() => handleSectionClick('blog')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800" 
                aria-label="Blog section"
              >
                Blog
              </button>
              <button 
                onClick={() => handleSectionClick('about')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800" 
                aria-label="About section"
              >
                About
              </button>
              <button 
                onClick={() => handleSectionClick('contact')} 
                className="block px-3 py-2 text-gray-700 hover:text-blue-800" 
                aria-label="Contact section"
              >
                Contact
              </button>
              {isLoggedIn ? (
                <>
                  <Link 
                    to={isAdmin ? '/admin-dashboard' : '/client-dashboard'} 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-800" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    aria-label={isAdmin ? "Admin Dashboard" : "Client Dashboard"}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800" 
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { openLoginModal(); setIsMobileMenuOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800" 
                  aria-label="Login"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Security notice */}
      <div className="bg-gray-100 p-2 text-sm text-gray-700" role="alert" aria-live="polite">
        This site uses secure authentication. MFA will be enabled soon for enhanced security.
      </div>
    </nav>
  );
}

export default Header;
