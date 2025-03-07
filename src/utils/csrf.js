import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

export const getCsrfToken = async () => {
  try {
    const fullUrl = `${API_URL}/api/csrf-token`;
    console.log('Fetching CSRF Token from:', fullUrl);
    
    const response = await axios.get(fullUrl, {
      withCredentials: true
    });
    
    console.log('CSRF Token response:', response.data);
    return response.data.csrfToken;
  } catch (error) {
    console.error('CSRF Token Fetch Error:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    throw error;
  }
};

export const setCsrfToken = (token) => {
  localStorage.setItem('csrfToken', token);
};

export const getStoredCsrfToken = () => {
  return localStorage.getItem('csrfToken');
};
