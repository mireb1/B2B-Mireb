const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/', messageController.createMessage);

// Protected routes
router.get('/', auth, messageController.getAllMessages);
router.get('/:id', auth, messageController.getMessage);
router.put('/:id/status', auth, adminAuth, messageController.updateMessageStatus);
router.delete('/:id', auth, adminAuth, messageController.deleteMessage);

module.exports = router;
