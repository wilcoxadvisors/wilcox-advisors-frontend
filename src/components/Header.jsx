import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header({ isLoggedIn, isAdmin, handleLogout, setShowLogin, setShowLoginModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle either prop name for the login modal
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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl text-blue-800 font-bold">WILCOX ADVISORS</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleSectionClick('services')} className="text-gray-700 hover:text-blue-800">Services</button>
            <button onClick={() => handleSectionClick('blog')} className="text-gray-700 hover:text-blue-800">Blog</button>
            <button onClick={() => handleSectionClick('about')} className="text-gray-700 hover:text-blue-800">About</button>
            <button onClick={() => handleSectionClick('contact')} className="text-gray-700 hover:text-blue-800">Contact</button>
            {isLoggedIn ? (
              <>
                <Link to={isAdmin ? '/admin-dashboard' : '/client-dashboard'} className="text-gray-700 hover:text-blue-800">Dashboard</Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-800">Logout</button>
              </>
            ) : (
              <button onClick={openLoginModal} className="text-gray-700 hover:text-blue-800">Login</button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-blue-800">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <button onClick={() => handleSectionClick('services')} className="block px-3 py-2 text-gray-700 hover:text-blue-800">Services</button>
              <button onClick={() => handleSectionClick('blog')} className="block px-3 py-2 text-gray-700 hover:text-blue-800">Blog</button>
              <button onClick={() => handleSectionClick('about')} className="block px-3 py-2 text-gray-700 hover:text-blue-800">About</button>
              <button onClick={() => handleSectionClick('contact')} className="block px-3 py-2 text-gray-700 hover:text-blue-800">Contact</button>
              {isLoggedIn ? (
                <>
                  <Link to={isAdmin ? '/admin-dashboard' : '/client-dashboard'} className="block px-3 py-2 text-gray-700 hover:text-blue-800" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800">Logout</button>
                </>
              ) : (
                <button onClick={() => { openLoginModal(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-800">Login</button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
