const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protected routes
router.get('/stats', auth, dashboardController.getDashboardStats);
router.get('/activity', auth, dashboardController.getActivityLogs);

module.exports = router;
