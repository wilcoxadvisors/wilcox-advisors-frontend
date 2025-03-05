// src/components/LoginModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

function LoginModal() {
  const { login } = useAuth();
  const { setShowLogin } = useUI();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, loginData);
      // Use the login function from AuthContext instead of prop methods
      login(response.data.token, response.data.isAdmin);
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
      setError('');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Client Login</h2>
          <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
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
            <button type="submit" className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition duration-200">
              Login
            </button>
            <button
              type="button"
              className="text-blue-800 hover:underline"
              onClick={() => alert('Forgot password functionality to be implemented')}
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
