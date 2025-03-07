import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://wilcox-advisors-backend.onrender.com';

export const getCsrfToken = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/csrf-token`, {
      withCredentials: true
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error('CSRF Token Fetch Error:', error);
    throw error;
  }
};

export const setCsrfToken = (token) => {
  localStorage.setItem('csrfToken', token);
};

export const getStoredCsrfToken = () => {
  return localStorage.getItem('csrfToken');
};
