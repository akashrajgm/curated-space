// ─── Proxy Bridge Protocol ────────────────────────────────────────────────────
// In dev: /api/* → Vite proxy → https://interior-marketplace-api.onrender.com/*
// In prod: direct to the Render URL (no proxy available)
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
const DIRECT_BASE_URL = 'https://interior-marketplace-api.onrender.com';
export const API_BASE_URL = isDev ? '/api' : DIRECT_BASE_URL;

// ─── No-Prefix Endpoints ──────────────────────────────────────────────────────
// These routes on Tharun's backend do NOT live under /api/* — they must bypass
// the Vite proxy and hit the Render URL directly (even in dev mode).
const DIRECT_ENDPOINTS = [
  '/users/me',
  '/vendors/profile',
  '/orders',
  '/wishlist',
  '/cart',
  '/register',
  '/login',
  '/token',
];

const isDirectEndpoint = (endpoint) =>
  DIRECT_ENDPOINTS.some(path => endpoint === path || endpoint.startsWith(path + '/'));

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.removeItem('jwt');
  }
};

export const getAuthToken = () => localStorage.getItem('jwt');

// ─── Health Check / Wake-up Ping ──────────────────────────────────────────────
export const wakeUpServer = async () => {
  const healthUrl = `${DIRECT_BASE_URL}/`;
  console.log('🟡 HEALTH PING →', healthUrl);
  try {
    const res = await fetch(healthUrl, { method: 'GET' });
    console.log('🟢 SERVER AWAKE:', res.status);
    return true;
  } catch (err) {
    console.error('🔴 HEALTH PING FAILED:', err.message);
    return false;
  }
};

export const apiClient = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Route: direct endpoints bypass the proxy; everything else goes through /api
  const base = isDev && !isDirectEndpoint(cleanEndpoint) ? API_BASE_URL : DIRECT_BASE_URL;
  const finalUrl = `${base}${cleanEndpoint}`;

  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  console.log(`🌐 ${options.method || 'GET'} ${finalUrl}`);

  try {
    const response = await fetch(finalUrl, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        // Silent for emergency review
        // console.error(`Backend → ${response.status} ${cleanEndpoint}`, errorBody);
        if (response.status === 401) {
          console.warn('🔓 401 — removing expired JWT');
          localStorage.removeItem('jwt');
          errorMessage = `401 Not Authenticated: ${errorBody.detail || 'Token rejected by server.'}`;
        } else if (response.status === 422 && Array.isArray(errorBody.detail)) {
          const missingFields = errorBody.detail.map(err => err.loc.join('.')).join(', ');
          errorMessage = `422 Missing Parameters: [${missingFields}]`;
        } else {
          errorMessage = errorBody.message || errorBody.detail || errorBody.error || errorMessage;
        }
      } catch (e) {}
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

  } catch (error) {
    if (error.message && error.message.includes('Failed to fetch')) {
      console.error('🚨 Network failure:', finalUrl);
    }
    throw error;
  }
};
