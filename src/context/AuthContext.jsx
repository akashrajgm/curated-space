import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthToken, getAuthToken, wakeUpServer, API_BASE_URL } from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ─── Bypass Hydration ─────────────────────────────────────────────────────────
// On mount, if bypass keys exist in localStorage, create the user object immediately
// so it survives refresh, manual URL entry, and hard navigation.
function hydrateBypass() {
  if (typeof window === 'undefined') return null;
  const active = localStorage.getItem('dev_bypass_active');
  const role = localStorage.getItem('dev_bypass_role');
  if (active === 'true' && role) {
    return {
      id: 'bypass-001',
      email: 'bypass@architect.dev',
      role: role,
      bypass: true
    };
  }
  return null;
}

export const AuthProvider = ({ children }) => {
  // Pre-emptive strike: initialize user from bypass if keys exist
  const [user, setUser] = useState(hydrateBypass);
  const [loading, setLoading] = useState(() => !hydrateBypass());

  const fetchUser = async () => {
    // If bypass is active, do NOT touch anything — just return the existing user
    const bypassActive = typeof window !== 'undefined' && localStorage.getItem('dev_bypass_active') === 'true';
    if (bypassActive) {
      setLoading(false);
      return user;
    }

    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiClient('/users/me');
      const resolvedRole = data.role === 'vendor' ? 'vendor' : 'customer';
      const resolvedUser = {
        ...data,
        role: resolvedRole,
        vendor_profile: data.vendor_profile || null,
      };
      setUser(resolvedUser);
      console.log('🔑 User synced:', { email: data.email, role: resolvedRole, hasVendorProfile: !!data.vendor_profile });
      return resolvedUser;
    } catch (err) {
      if (bypassActive) {
        console.warn('fetchUser failed during bypass. Keeping bypass user.');
        setLoading(false);
        return user;
      }
      console.warn('Could not fetch user profile, logging out.', err);
      setAuthToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If bypass is already hydrated, skip the network call entirely
    const bypassActive = localStorage.getItem('dev_bypass_active') === 'true';
    if (bypassActive) {
      setLoading(false);
      return;
    }
    fetchUser();
  }, []);

  // ─── LOGIN: OAuth2PasswordRequestForm compatible ────────────────────────────────
  // FastAPI's OAuth2PasswordRequestForm expects:
  //   Content-Type: application/x-www-form-urlencoded
  //   Body: username=<email>&password=<password>
  const login = async (email, password) => {
    await wakeUpServer();

    const formParams = new URLSearchParams();
    formParams.append('username', email);  // OAuth2 spec: 'username' not 'email'
    formParams.append('password', password);

    console.log('📤 LOGIN PAYLOAD:', { username: email, password: '***', contentType: 'application/x-www-form-urlencoded' });

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString(),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('🔴 Login response:', res.status, errBody);
        if (res.status === 500) {
          throw new Error('500 Server Error — Backend OAuth2 mismatch. Tharun needs to check Render logs for a Traceback.');
        }
        if (res.status === 422) {
          const detail = Array.isArray(errBody.detail)
            ? errBody.detail.map(e => e.loc?.join('.') + ': ' + e.msg).join(', ')
            : errBody.detail;
          throw new Error(`422 Validation: ${detail}`);
        }
        throw new Error(errBody.detail || errBody.message || `Login failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('🟢 Login response:', data);
      const jwt = data.token || data.access_token;
      if (!jwt) throw new Error('No token in login response');

      setAuthToken(jwt);

      // If login response contains user object, use it directly
      if (data.user && data.user.role) {
        const resolvedUser = { ...data.user, role: data.user.role === 'vendor' ? 'vendor' : 'customer' };
        setUser(resolvedUser);
        return resolvedUser;
      }
      // Otherwise fetch profile
      return await fetchUser();

    } catch (err) {
      console.error('Login failed:', err.message);
      throw err;
    }
  };

  // ─── ZERO-RESISTANCE REGISTER ───────────────────────────────────────────────
  const register = async (formData) => {
    await wakeUpServer();
    const payload = {
      email: formData.email,
      password: formData.password,
      role: formData.role || 'customer',  // Null safety
    };
    
    console.log('📤 SENDING REGISTRATION:', JSON.stringify(payload, null, 2));
    
    // Verify no nulls or undefined
    if (!payload.email || !payload.password || !payload.role) {
      console.error('🚨 PAYLOAD INCOMPLETE:', payload);
      throw new Error('Registration payload is missing required fields');
    }

    try {
      const data = await apiClient('/register', { method: 'POST', body: JSON.stringify(payload) });
      console.log('📋 Register Receipt:', data);

      if (data && data.role) {
        const resolvedUser = { ...data, role: data.role === 'vendor' ? 'vendor' : 'customer' };
        setUser(resolvedUser);
        return resolvedUser;
      }

      const jwt = data?.token || data?.access_token;
      if (jwt) {
        setAuthToken(jwt);
        return await fetchUser();
      }

      return await login(formData.email, formData.password);
    } catch (err) {
      console.error('API Error (Register):', err.message);
      console.error('Full stack:', err.stack);
      throw err;
    }
  };

  // ─── GOD MODE: Survives refresh, manual URL, hard navigation ────────────────
  const bypassAuth = (role = 'vendor') => {
    const mockUser = {
      id: 'bypass-001',
      email: 'bypass@architect.dev',
      role: role,
      bypass: true
    };
    // Write to React state
    setUser(mockUser);
    setLoading(false);
    // Write to localStorage — survives everything
    localStorage.setItem('dev_bypass_active', 'true');
    localStorage.setItem('dev_bypass_role', role);
    console.log(`🔓 GOD MODE ACTIVE: role="${role}". Survives refresh. Expires in 5 minutes.`);
    console.log('To deactivate: window.__clearBypass()');
    // Auto-expire after 5 minutes
    setTimeout(() => {
      localStorage.removeItem('dev_bypass_active');
      localStorage.removeItem('dev_bypass_role');
      setUser(null);
      console.log('🔒 GOD MODE EXPIRED.');
    }, 300000);
    // Hard redirect to the target dashboard
    window.location.href = role === 'vendor' ? '/vendor/dashboard' : '/';
  };

  const clearBypass = () => {
    localStorage.removeItem('dev_bypass_active');
    localStorage.removeItem('dev_bypass_role');
    setUser(null);
    console.log('🔒 Bypass manually cleared.');
    window.location.href = '/';
  };

  // Expose to browser console
  if (typeof window !== 'undefined') {
    window.__bypassAuth = bypassAuth;
    window.__clearBypass = clearBypass;
  }

  const logout = () => {
    localStorage.removeItem('dev_bypass_active');
    localStorage.removeItem('dev_bypass_role');
    setAuthToken(null);
    setUser(null);
  };

  // — Merge partial updates into the user object without a full re-fetch —
  // e.g. after PATCH /users/me: updateUser({ name: 'Akash' })
  const updateUser = (partialData) => {
    setUser(prev => prev ? { ...prev, ...partialData } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, loading, login, register, logout, fetchUser, bypassAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
