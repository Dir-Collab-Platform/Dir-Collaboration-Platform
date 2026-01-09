const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Base fetch wrapper with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    throw new Error('Mock mode: Use mock service functions instead');
  }

  const url = `${BASE_URL}${endpoint}`;

  // Get token from storage
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized globally (optional but recommended)
    if (response.status === 401) {
      // dispatch event or clear storage if needed, but for now just throw
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login'; 
    }

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
