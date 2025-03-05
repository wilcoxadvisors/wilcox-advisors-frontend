import api from './api';

/**
 * Fetches a CSRF token from the server
 * @returns {Promise<string>} The CSRF token
 */
export const getCsrfToken = async () => {
  try {
    const response = await api.get('/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw error;
  }
};

/**
 * Sets the CSRF token in localStorage
 * @param {string} token The CSRF token to store
 */
export const setCsrfToken = (token) => {
  localStorage.setItem('csrfToken', token);
};

/**
 * Gets the CSRF token from localStorage
 * @returns {string|null} The CSRF token or null if not found
 */
export const getStoredCsrfToken = () => {
  return localStorage.getItem('csrfToken');
};

/**
 * Refreshes the CSRF token
 * @returns {Promise<string>} The new CSRF token
 */
export const refreshCsrfToken = async () => {
  const token = await getCsrfToken();
  setCsrfToken(token);
  return token;
};
