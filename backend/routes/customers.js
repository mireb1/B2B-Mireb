const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protected routes
router.get('/', auth, customerController.getAllCustomers);
router.get('/:id', auth, customerController.getCustomer);
router.put('/:id', auth, adminAuth, customerController.updateCustomer);
router.delete('/:id', auth, adminAuth, customerController.deleteCustomer);

module.exports = router;
