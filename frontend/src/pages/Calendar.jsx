import React, { useState, useEffect } from 'react';
import './Calendar.css';
import categoryColors from '../utils/categoryColors';
const API_BASE = 'http://localhost:5000/api';

export default function Calendar() {
  const [view, setView] = useState('daily');
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      const res = await fetch(`${API_BASE}/habits`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        setHabits(await res.json());
      }
      setLoading(false);
    };
    fetchHabits();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });

  const handleMarkCompleted = async (habit) => {
    if (!window.confirm('Mark as Completed?')) return;
    setMarking(habit._id);
    const res = await fetch(`${API_BASE}/habits/${habit._id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ date: today }),
    });
    if (res.ok) {
      setHabits(habits => habits.map(h => h._id === habit._id ? { ...h, completedDates: [...(h.completedDates || []), today] } : h));
    }
    setMarking(null);
  };

  function habitsForDay(day) {
    return habits
      .filter(habit => habit.selectedDays && habit.selectedDays.includes(day))
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  // Get current week's dates
  function getWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Monday start
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  }

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekDates = getWeekDates();

  // Filter habits for current day only in Daily View
  const dailyHabits = habits
    .filter(habit => habit.selectedDays && habit.selectedDays.includes(currentDay))
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  function getBgColor(category) {
    return categoryColors[category] || categoryColors.Other;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">Calendar</h2>
        <div className="calendar-toggle-group">
          <button
            className={`calendar-toggle${view === 'daily' ? ' active' : ''}`}
            onClick={() => setView('daily')}
          >
            Daily View
          </button>
          <button
            className={`calendar-toggle${view === 'weekly' ? ' active' : ''}`}
            onClick={() => setView('weekly')}
          >
            Weekly View
          </button>
        </div>
      </div>
      {loading ? (
        <div className="calendar-empty">Loading habits...</div>
      ) : view === 'daily' ? (
        <div className="calendar-daily-centered">
          {/* Current date and day display */}
          <div style={{ 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            color: '#b5651d',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#f5f1e8',
            borderRadius: '8px',
            border: '1px solid #d4a574'
          }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          {dailyHabits.length === 0 ? (
            <div className="calendar-empty">No habits scheduled for {currentDay}</div>
          ) : (
            dailyHabits.map(habit => {
              const completed = (habit.completedDates || []).includes(today);
              return (
                <div key={habit._id} className="habit-block" style={{ background: getBgColor(habit.category), color: '#222' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={completed ? 'habit-block completed' : ''} style={{ fontWeight: 600, fontSize: '1.1rem', textDecoration: completed ? 'line-through' : 'none', background: 'none', color: completed ? '#6b4226' : undefined }}>
                      {habit.name}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{habit.category}</div>
                    <span style={{ marginLeft: 8, fontSize: '0.95rem' }}>{habit.startTime} - {habit.endTime}</span>
                  </div>
                  <button
                    onClick={() => handleMarkCompleted(habit)}
                    disabled={completed || marking === habit._id}
                    className="habit-block-btn"
                  >
                    {completed ? 'Completed' : marking === habit._id ? 'Marking...' : 'Mark as Completed'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="calendar-grid">
          {weekDays.map((day, index) => (
            <div key={day} className="day-cell">
              {/* Date and day name display */}
              <div style={{ 
                textAlign: 'center', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#b5651d',
                marginBottom: '0.5rem',
                padding: '0.25rem',
                backgroundColor: '#f5f1e8',
                borderRadius: '4px',
                border: '1px solid #d4a574'
              }}>
                <div>{day}</div>
                <div style={{ fontSize: '0.8rem', color: '#8b4513' }}>
                  {weekDates[index].toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="day-habits">
                {habitsForDay(day).length === 0 ? (
                  <div className="calendar-empty">No habits</div>
                ) : habitsForDay(day).map(habit => {
                  // For weekly view, check if completed for this specific date
                  const dateStr = weekDates[index].toISOString().slice(0, 10);
                  const completed = (habit.completedDates || []).includes(dateStr);
                  return (
                    <div key={habit._id} className="habit-block" style={{ minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: getBgColor(habit.category), color: '#222' }}>
                      <div className={completed ? 'habit-block completed' : ''} style={{ fontWeight: 600, fontSize: '1.05rem', textDecoration: completed ? 'line-through' : 'none', background: 'none', color: completed ? '#6b4226' : undefined }}>
                        {habit.name}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#222' }}>{habit.startTime} - {habit.endTime}</span>
                      <div style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          onClick={() => handleMarkCompleted(habit)}
                          disabled={completed || marking === habit._id}
                          className="habit-block-btn"
                          style={{ maxWidth: '180px', width: '100%', fontSize: '0.85rem', margin: '0 auto', display: 'block' }}
                        >
                          {completed ? 'Completed' : marking === habit._id ? 'Marking...' : 'Mark as Completed'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 