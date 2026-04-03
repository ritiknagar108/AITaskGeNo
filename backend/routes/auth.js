const express = require('express');
const { register, login, getProfile, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/update-password', auth, updatePassword);

module.exports = router;