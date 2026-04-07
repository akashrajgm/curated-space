import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthToken, getAuthToken } from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiClient('/users/me');
      setUser(data);
    } catch (err) {
      console.warn("Could not fetch user, automatically logged out.", err);
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiClient('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Map JWT structures effectively depending upon OAS API payload rules. Assumes token/access_token
    const jwt = data.token || data.access_token;
    if (jwt) {
      setAuthToken(jwt);
      await fetchUser(); // Reload profile immediately into memory
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
