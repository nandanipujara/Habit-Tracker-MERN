import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const { signup, isLoggedIn, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, [isLoggedIn, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await signup(form.name, form.email, form.password);
  };

  const EyeOpen = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5651d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="12" cy="12" r="2"/></svg>
  );
  const EyeClosed = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5651d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.61"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
  );

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="signup-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="signup-input"
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="signup-input"
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
        {error && <div className="signup-error">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="signup-btn"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#3c2f2f' }}>Already have an account? </span>
          <button type="button" className="signup-link" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </form>
    </div>
  );
} 