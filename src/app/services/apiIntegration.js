const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get tokens
export const getToken = () => localStorage.getItem('token');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

// API call wrapper
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});
  
  // Only set Content-Type if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Network error: Cannot connect to the server. Please check your internet connection or try again later.');
    }
    throw err;
  }

  // Handle Token Expiration (401) via Refresh Token
  if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('token', refreshData.token);
          localStorage.setItem('refreshToken', refreshData.refreshToken);
          
          // Retry original request with new token
          headers.set('Authorization', `Bearer ${refreshData.token}`);
          response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
          });
        } else {
          throw new Error('Refresh failed');
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Force redirect
        throw new Error('Session expired. Please log in again.');
      }
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const authService = {
  login: async (credentials) => {
    const data = await apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
    
  register: async (userData) => {
    const data = await apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  logout: async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
};

export const listingService = {
  getAll: () => apiCall('/listings'),
  
  create: async (formData) => {
    // FormData works out-of-the-box with our updated apiCall
    return apiCall('/listings', {
      method: 'POST',
      body: formData,
    });
  }
};
