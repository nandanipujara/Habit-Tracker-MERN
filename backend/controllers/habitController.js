const Habit = require('../models/Habit');
const mongoose = require('mongoose');

// Create new habit
exports.createHabit = async (req, res) => {
  try {
    const { name, startTime, endTime, selectedDays, category } = req.body;
    const habit = new Habit({
      name,
      startTime,
      endTime,
      selectedDays,
      category,
      userId: req.user.userId
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all habits for a user
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all habits for a user
exports.deleteAllHabits = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    await Habit.deleteMany({ userId });
    res.json({ message: 'All habits deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a habit
exports.updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startTime, endTime, selectedDays, category, reminderEnabled } = req.body;
    const updateFields = { name, startTime, endTime, selectedDays, category };
    if (reminderEnabled !== undefined) updateFields.reminderEnabled = reminderEnabled;
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateFields,
      { new: true }
    );
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark habit completed for a day and update streak
exports.markHabitCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body; // date in YYYY-MM-DD
    const habit = await Habit.findOne({ _id: id, userId: req.user.userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    if (!habit.completedDates) habit.completedDates = [];
    // Check if already completed for this date
    if (habit.completedDates.includes(date)) {
      return res.status(400).json({ message: 'Habit already marked as completed for this day' });
    }
    habit.completedDates.push(date);
    // Streak logic
    habit.completedDates.sort();
    let streak = 0;
    let prevDate = null;
    for (let d of habit.completedDates) {
      if (!prevDate) {
        streak = 1;
      } else {
        const diff = (new Date(d) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
        } else if (diff > 1) {
          streak = 1;
        }
      }
      prevDate = d;
    }
    habit.streak = streak;
    await habit.save();
    res.json({ message: 'Habit marked as completed', streak: habit.streak });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 