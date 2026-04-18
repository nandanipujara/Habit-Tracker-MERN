const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const auth = require('../middleware/auth');

router.post('/', auth, habitController.createHabit);
router.get('/', auth, habitController.getHabits);
router.put('/:id', auth, habitController.updateHabit);
router.delete('/all', auth, habitController.deleteAllHabits);
router.delete('/:id', auth, habitController.deleteHabit);
router.post('/:id/complete', auth, habitController.markHabitCompleted);


module.exports = router; 