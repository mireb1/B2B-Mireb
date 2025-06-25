// Routes pour la gestion des utilisateurs
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Routes d'authentification
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.get('/me', auth, userController.getCurrentUser);

// Routes de gestion des utilisateurs (admin ou gestionnaire)
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

// Routes pour les sous-comptes
router.get('/sub-accounts/:parentId', auth, userController.getSubAccounts);
router.post('/sub-accounts/:parentId', auth, userController.createSubAccount);

// Routes de gestion des rôles et permissions
router.get('/roles/all', auth, userController.getAllRoles);
router.get('/permissions/all', auth, userController.getAllPermissions);

// Routes de gestion des mots de passe
router.post('/change-password', auth, userController.changePassword);
router.post('/reset-password', userController.resetPassword);

// Routes de gestion du profil
router.put('/profile/:id', auth, userController.updateProfile);
router.put('/settings/:id', auth, userController.updateSettings);

// Routes de gestion du statut
router.patch('/:id/toggle-status', auth, userController.toggleUserStatus);

// Routes de statistiques
router.get('/stats/overview', auth, userController.getUserStats);

// Routes d'export/import
router.get('/export/all', auth, userController.exportUsers);
router.post('/import', auth, userController.importUsers);

module.exports = router;
