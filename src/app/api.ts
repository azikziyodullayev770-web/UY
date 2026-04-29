const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiCall = async (endpoint: string, method: string = 'GET', body?: any, token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API call failed');
  }

  return response.json();
};

export const authApi = {
  register: (data: any) => apiCall('/auth/register', 'POST', data),
  login: (data: any) => apiCall('/auth/login', 'POST', data),
  getMe: (token: string) => apiCall('/auth/me', 'GET', undefined, token),
};

export const postsApi = {
  getPosts: () => apiCall('/posts'),
  createPost: (data: any, token: string) => apiCall('/posts', 'POST', data, token),
  deletePost: (id: string, token: string) => apiCall('/posts/' + id, 'DELETE', undefined, token),
};
