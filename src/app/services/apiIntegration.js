const API_URL = 'http://localhost:5000/api';

// Helper to get token
export const getToken = () => localStorage.getItem('token');

// API call wrapper
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const authService = {
  login: (credentials) => 
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    
  register: (userData) => 
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

export const listingService = {
  getAll: () => apiCall('/listings'),
  
  create: async (formData) => {
    // For FormData, we don't set Content-Type header so the browser can set the boundary
    const token = getToken();
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }
};
