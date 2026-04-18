const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  selectedDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  category: { type: String, required: true },
  streak: { type: Number, default: 0 },
  completedDates: [{ type: String }],
  reminderEnabled: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema); 
//link express code to mongo db 