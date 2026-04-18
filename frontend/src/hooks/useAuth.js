import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setLoading(false);
      navigate('/dashboard');
      return { success: true };
    } else {
      const err = await res.json();
      setError(err.message || 'Login failed');
      setLoading(false);
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    const res = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) {
      // After signup, log in automatically
      setLoading(false);
      return await login(email, password);
    } else {
      const err = await res.json();
      setError(err.message || 'Signup failed');
      setLoading(false);
      return { success: false, message: err.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 