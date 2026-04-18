import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { login, isLoggedIn, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, [isLoggedIn, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  const EyeOpen = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5651d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="12" cy="12" r="2"/></svg>
  );
  const EyeClosed = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5651d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.61"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Log In</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="login-input"
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="login-input"
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: '#b5651d',
              padding: 0
            }}
          >
            {showPassword ? EyeClosed : EyeOpen}
          </button>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="login-btn"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#3c2f2f' }}>Don't have an account? </span>
          <button type="button" className="login-link" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </form>
    </div>
  );
} 