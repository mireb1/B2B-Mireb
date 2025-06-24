const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes - Admin only
router.post('/', auth, adminAuth, productController.createProduct);
router.put('/:id', auth, adminAuth, productController.updateProduct);
router.delete('/:id', auth, adminAuth, productController.deleteProduct);

module.exports = router;
