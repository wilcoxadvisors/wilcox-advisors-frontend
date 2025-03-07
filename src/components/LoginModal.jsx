// src/components/LoginModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { getCsrfToken } from '../utils/csrf';

function LoginModal({ setShowLoginModal, setIsLoggedIn, setIsAdmin }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch CSRF token when component mounts
    const fetchToken = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token);
      } catch (error) {
        console.error('CSRF Token Fetch Error:', error);
        setError('Unable to initialize secure login. Please try again.');
      }
    };
    
    fetchToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Check if we have a CSRF token
    if (!csrfToken) {
      try {
        // Try to get a new token if we don't have one
        const token = await getCsrfToken();
        setCsrfToken(token);
      } catch (error) {
        setError('Security token missing. Please refresh the page and try again.');
        return;
      }
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Configure axios for this specific request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://wilcox-advisors-backend.onrender.com'}/api/login`, 
        loginData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          withCredentials: true
        }
      );
      
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      
      // Update state
      setIsLoggedIn(true);
      setIsAdmin(response.data.isAdmin);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login Error:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        switch (error.response.status) {
          case 401:
            setError('Invalid email or password. Please try again.');
            break;
          case 403:
            // On CSRF error, try to get a new token and ask the user to try again
            try {
              const newToken = await getCsrfToken();
              setCsrfToken(newToken);
              setError('Session expired. Please try logging in again.');
            } catch (e) {
              setError('Security validation failed. Please refresh the page.');
            }
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(error.response.data?.message || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Client Login</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-6 flex justify-between items-center">
            <button 
              type="submit" 
              className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              className="text-blue-800 hover:underline"
              onClick={() => alert('Please contact support to reset your password.')}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
