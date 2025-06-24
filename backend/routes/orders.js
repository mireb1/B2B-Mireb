const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/', orderController.createOrder);

// Protected routes
router.get('/', auth, orderController.getAllOrders);
router.get('/:id', auth, orderController.getOrder);
router.put('/:id/status', auth, adminAuth, orderController.updateOrderStatus);
router.delete('/:id', auth, adminAuth, orderController.deleteOrder);

module.exports = router;
