const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Routes publiques
router.post('/', orderController.createOrder);

// Routes protégées (authentification requise)
router.get('/', auth, orderController.getAllOrders);
router.get('/:id', auth, orderController.getOrder);
router.get('/stats/dashboard', auth, adminAuth, orderController.getOrderStats);

// Routes protégées (admin uniquement)
router.put('/:id/status', auth, adminAuth, orderController.updateOrderStatus);
router.put('/:id/delivery', auth, adminAuth, orderController.updateDeliveryInfo);
router.put('/:id/tracking', auth, orderController.updateDeliveryTracking);
router.delete('/:id', auth, adminAuth, orderController.deleteOrder);

module.exports = router;
