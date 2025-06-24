const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/login', authController.login);

// Admin routes - initial setup only
router.post('/register', authController.register);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;
