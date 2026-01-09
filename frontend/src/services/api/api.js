const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const apiRequest = async (endpoint, options = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    throw new Error('Mock mode: Use mock service functions instead');
  }

  // REFACTORED: Construct URL with query parameters
  let url = `${BASE_URL}${endpoint}`;
  
  if (options.params) {
    const queryParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      // Only append if value is not null, undefined, or empty
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

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

    if (response.status === 401) {
      localStorage.removeItem('token');
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