import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const API_BASE = 'http://localhost:5000/api';

const CATEGORY_OPTIONS = [
  { value: 'Health', label: 'Health' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Self-care', label: 'Self-care' },
  { value: 'Skill', label: 'Skill' },
  { value: 'Other', label: 'Other' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Dashboard() {
  const { isLoggedIn } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    startTime: '',
    endTime: '',
    selectedDays: [],
    category: 'Health',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchHabits = async () => {
      setLoading(true);
      const res = await fetch(`${API_BASE}/habits`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHabits(data.sort((a, b) => a.name.localeCompare(b.name)));
      }
      setLoading(false);
    };
    fetchHabits();
  }, [isLoggedIn]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDayToggle = day => {
    setForm(f => ({
      ...f,
      selectedDays: f.selectedDays.includes(day)
        ? f.selectedDays.filter(d => d !== day)
        : [...f.selectedDays, day],
    }));
  };
  const handleCategoryChange = e => {
    setForm(f => ({ ...f, category: e.target.value }));
  };

  const handleEdit = habit => {
    const cat = CATEGORY_OPTIONS.some(opt => opt.value === habit.category) ? habit.category : 'Other';
    setForm({
      name: habit.name,
      startTime: habit.startTime,
      endTime: habit.endTime,
      selectedDays: habit.selectedDays,
      category: cat,
    });
    setEditId(habit._id);
    setExpanded(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const body = {
      name: form.name,
      startTime: form.startTime,
      endTime: form.endTime,
      selectedDays: form.selectedDays,
      category: form.category,
    };
    let res, updatedHabit;
    if (editId) {
      res = await fetch(`${API_BASE}/habits/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        updatedHabit = await res.json();
        setHabits(hs => hs.map(h => h._id === editId ? updatedHabit : h).sort((a, b) => a.name.localeCompare(b.name)));
        setEditId(null);
        setExpanded(false);
        setForm({ name: '', startTime: '', endTime: '', selectedDays: [], category: 'Health' });
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to update habit');
      }
    } else {
      res = await fetch(`${API_BASE}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newHabit = await res.json();
        setHabits(hs => [...hs, newHabit].sort((a, b) => a.name.localeCompare(b.name)));
        setForm({ name: '', startTime: '', endTime: '', selectedDays: [], category: 'Health' });
        setExpanded(false);
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to add habit');
      }
    }
    setSubmitting(false);
  };

  const handleCancel = () => {
    setEditId(null);
    setExpanded(false);
    setForm({ name: '', startTime: '', endTime: '', selectedDays: [], category: 'Health' });
  };

  const handleDelete = async id => {
    await fetch(`${API_BASE}/habits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setHabits(hs => hs.filter(h => h._id !== id));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-add-block dashboard-add-block-centered dashboard-add-block-wide">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="dashboard-add-btn"
            >
              + Add New Habit
            </button>
          ) : (
            <div className="dashboard-add-btn-wrapper">
              <form onSubmit={handleSubmit} className="dashboard-form dashboard-form-narrow">
                <input
                  type="text"
                  name="name"
                  placeholder="Habit Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="dashboard-input"
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label className="dashboard-form-label" style={{ marginBottom: '0.2rem' }}>Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="dashboard-input"
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label className="dashboard-form-label" style={{ marginBottom: '0.2rem' }}>End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                      className="dashboard-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="dashboard-form-label" style={{ marginBottom: '0.2rem', display: 'block' }}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleCategoryChange}
                    className="dashboard-category"
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="dashboard-form-label" style={{ marginBottom: '0.2rem', display: 'block' }}>Days of the Week</label>
                  <div className="dashboard-days">
                    {DAYS.map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`dashboard-day-btn${form.selectedDays.includes(day) ? ' selected' : ''}`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <div className="dashboard-error">{error}</div>}
                <div className="dashboard-btn-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="dashboard-btn"
                  >
                    {submitting ? 'Adding...' : editId ? 'Update Habit' : 'Add Habit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="dashboard-btn dashboard-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="dashboard-habit-list">
          {loading ? (
            <div className="dashboard-empty">Loading habits...</div>
          ) : habits.length === 0 ? (
            <div className="dashboard-empty">No habits yet. Add your first habit!</div>
          ) : (
            habits.map(habit => (
              <div key={habit._id} className="dashboard-habit-row-flex">
                <div className="dashboard-habit-card dashboard-habit-card-vertical dashboard-habit-card-70">
                  <div className="dashboard-habit-card-toprow">
                    <div className="dashboard-habit-category-badge">{habit.category}</div>
                    <div className="dashboard-habit-title-vertical">{habit.name}</div>
                    <div className="dashboard-habit-time-vertical">{habit.startTime} - {habit.endTime}</div>
                  </div>
                  <div className="dashboard-habit-card-btn-row-vertical">
                    <button
                      onClick={() => handleEdit(habit)}
                      className="dashboard-edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(habit._id)}
                      className="dashboard-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="dashboard-streak-block">
                  <div className="dashboard-streak-title">{habit.name} streak</div>
                  <div className="dashboard-streak-value">{habit.streak ?? 0}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 