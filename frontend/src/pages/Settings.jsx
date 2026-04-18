import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Settings.css';

const API_BASE = 'http://localhost:5000/api';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const navigate = useNavigate();

  const handleThemeToggle = () => toggleTheme();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your habits and data.');
    if (!confirmed) return;

    setDeleting(true);
    setDeleteMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setDeleteMsg('Not authenticated. Please log in again.');
        setDeleting(false);
        return;
      }

      // First, get user ID from token
      let userId;
      try {
        const base64 = token.split('.')[1];
        const payload = JSON.parse(atob(base64));
        userId = payload.userId;
      } catch (e) {
        setDeleteMsg('Unable to identify user. Please log in again.');
        setDeleting(false);
        return;
      }

      // Delete user account
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Clear local storage and logout
        localStorage.removeItem('token');
        logout();
        navigate('/login');
        setDeleteMsg('Account successfully deleted.');
      } else {
        const err = await res.json().catch(() => ({}));
        setDeleteMsg(err.message || 'Failed to delete account');
        setDeleting(false);
      }
    } catch (error) {
      setDeleteMsg('Error deleting account. Please try again.');
      setDeleting(false);
      console.error('Error deleting account:', error);
    }
  };

  const handleResetAllHabits = async () => {
    const confirmed = window.confirm('Are you sure you want to reset all your habits? This action cannot be undone.');
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('token');
      let userId;
      try {
        const base64 = token.split('.')[1];
        const payload = JSON.parse(atob(base64));
        userId = payload.userId;
      } catch (e) {
        alert('Unable to identify user. Please log in again.');
        return;
      }
      const res = await fetch(`${API_BASE}/habits/all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        alert('All habits have been reset.');
        navigate('/dashboard');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to reset habits');
      }
    } catch (e) {
      alert('Failed to reset habits');
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>


      <div className="settings-section" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex' }}>
        <span className="label" style={{ marginBottom: 0 }}>Theme</span>
        <button onClick={handleThemeToggle} className="theme-toggle">
          {theme === 'dark' ? <span role="img" aria-label="moon">🌙</span> : <span role="img" aria-label="sun">🌞</span>}
        </button>
      </div>

      <div className="settings-section">
        <span className="label">Delete Account</span>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="delete-btn"
        >
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
        {deleteMsg && <div className="error-msg">{deleteMsg}</div>}
      </div>

      <div className="settings-section">
        <span className="label">Reset All Habits</span>
        <button
          onClick={handleResetAllHabits}
          className="delete-btn"
        >
          Reset All Habits
        </button>
      </div>
    </div>
  );
} 