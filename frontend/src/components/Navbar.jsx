import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => logout();

  return (
    <nav className="navbar">
      <div className="navbar-title">Habit Tracker</div>
      {isLoggedIn && (
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link${location.pathname === link.to ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          className="navbar-theme-toggle"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '🌞'}
        </button>
        {isLoggedIn && (
          <button onClick={handleLogout} className="navbar-logout-btn">Log Out</button>
        )}
      </div>
    </nav>
  );
} 