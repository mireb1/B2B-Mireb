// Routes pour la gestion des livraisons
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const auth = require('../middleware/auth');

// Obtenir toutes les livraisons
router.get('/', auth, deliveryController.getAllDeliveries);

// Obtenir une livraison par ID
router.get('/:id', auth, deliveryController.getDeliveryById);

// Obtenir une livraison par numéro de suivi
router.get('/tracking/:trackingNumber', deliveryController.getDeliveryByTracking);

// Créer une nouvelle livraison
router.post('/', auth, deliveryController.createDelivery);

// Mettre à jour une livraison
router.put('/:id', auth, deliveryController.updateDelivery);

// Mettre à jour le statut d'une livraison
router.patch('/:id/status', auth, deliveryController.updateDeliveryStatus);

// Assigner un livreur
router.patch('/:id/assign', auth, deliveryController.assignDriver);

// Ajouter une note à une livraison
router.post('/:id/notes', auth, deliveryController.addNote);

// Obtenir les statistiques de livraison
router.get('/stats/overview', auth, deliveryController.getDeliveryStats);

// Optimiser les tournées
router.post('/optimize', auth, deliveryController.optimizeRoutes);

// Obtenir les livraisons par livreur
router.get('/driver/:driverId', auth, deliveryController.getDeliveriesByDriver);

// Obtenir les livraisons du jour
router.get('/today/all', auth, deliveryController.getTodayDeliveries);

// Supprimer une livraison
router.delete('/:id', auth, deliveryController.deleteDelivery);

// Routes pour les livreurs
router.get('/drivers/all', auth, deliveryController.getAllDrivers);
router.post('/drivers', auth, deliveryController.createDriver);
router.put('/drivers/:id', auth, deliveryController.updateDriver);
router.delete('/drivers/:id', auth, deliveryController.deleteDriver);

// Routes pour les zones de livraison
router.get('/zones/all', auth, deliveryController.getAllZones);
router.post('/zones', auth, deliveryController.createZone);
router.put('/zones/:id', auth, deliveryController.updateZone);
router.delete('/zones/:id', auth, deliveryController.deleteZone);

// Export Excel des livraisons
router.get('/export/excel', auth, deliveryController.exportToExcel);

// Import de livraisons
router.post('/import', auth, deliveryController.importDeliveries);

module.exports = router;
