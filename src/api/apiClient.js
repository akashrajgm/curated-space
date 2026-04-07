export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://interior-marketplace-api.onrender.com';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.removeItem('jwt');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('jwt');
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Attempt to throw informative error if not ok
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Attempt to parse JSON correctly
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      return data;
    } else {
      return await response.text();
    }

  } catch (error) {
    throw error;
  }
};
