require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewarea
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

app.get('/', (req, res) => {
  res.send('Daily Habit Tracker API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 