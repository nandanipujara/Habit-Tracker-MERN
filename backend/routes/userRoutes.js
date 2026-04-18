const express = require('express');
const router = express.Router();
const { signup, login, deleteAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.delete('/:userId', auth, deleteAccount);

module.exports = router; 