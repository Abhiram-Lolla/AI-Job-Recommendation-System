import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      
      // Fetch full profile from the new endpoint
      const profileRes = await authService.getProfile();
      const userObj = profileRes.data;
      
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (name, email, password) => {
      try {
        await authService.register(name, email, password);
        await login(email, password);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
  };

  const value = { user, login, logout, register, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
