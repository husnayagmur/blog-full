const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/users', getAllUsers);

module.exports = router;
