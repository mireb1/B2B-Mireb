const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Routes publiques
router.get('/', categoryController.getAllCategories);
router.get('/main', categoryController.getMainCategories);
router.get('/:id', categoryController.getCategory);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id/subcategories', categoryController.getSubcategories);

// Routes protégées (admin uniquement)
router.post('/', auth, adminAuth, categoryController.createCategory);
router.put('/:id', auth, adminAuth, categoryController.updateCategory);
router.delete('/:id', auth, adminAuth, categoryController.deleteCategory);

module.exports = router;
