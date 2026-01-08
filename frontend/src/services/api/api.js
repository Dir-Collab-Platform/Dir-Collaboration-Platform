// Base API configuration
// When integrating with real backend, update BASE_URL and implement real fetch calls

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // Default to true for development

/**
 * Base fetch wrapper with error handling
 * Replace this with your actual API client (axios, fetch, etc.)
 */
const apiRequest = async (endpoint, options = {}) => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    throw new Error('Mock mode: Use mock service functions instead');
  }

  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export { BASE_URL, USE_MOCK, apiRequest };
