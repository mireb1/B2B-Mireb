// Contrôleur pour la gestion des livraisons
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Obtenir toutes les livraisons
exports.getDeliveries = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            driver,
            startDate,
            endDate,
            search,
            sortBy = 'scheduledDate',
            sortOrder = 'asc'
        } = req.query;

        const query = {};
        
        // Filtres
        if (status) query.status = status;
        if (driver) query['driver.name'] = driver;
        
        // Filtre par date
        if (startDate || endDate) {
            query.scheduledDate = {};
            if (startDate) query.scheduledDate.$gte = new Date(startDate);
            if (endDate) query.scheduledDate.$lte = new Date(endDate);
        }
        
        // Recherche par numéro de suivi
        if (search) {
            query.trackingNumber = { $regex: search, $options: 'i' };
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
            populate: [
                { 
                    path: 'order', 
                    select: 'orderNumber totalAmount status',
                    populate: {
                        path: 'items.product',
                        select: 'name price'
                    }
                },
                { path: 'customer', select: 'firstName lastName email phone' }
            ]
        };

        const result = await Delivery.paginate(query, options);
        
        res.json({
            success: true,
            data: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalDeliveries: result.totalDocs,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });
    } catch (error) {
        console.error('Erreur getDeliveries:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des livraisons',
            error: error.message
        });
    }
};

// Créer une nouvelle livraison
exports.createDelivery = async (req, res) => {
    try {
        const {
            orderId,
            driverName,
            driverPhone,
            scheduledDate,
            priority = 'normal',
            notes
        } = req.body;

        // Vérifier que la commande existe
        const order = await Order.findById(orderId).populate('customer items.product');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        // Créer l'adresse de livraison depuis la commande
        const deliveryAddress = {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country || 'France',
            instructions: order.shippingAddress.instructions
        };

        // Préparer les articles à livrer
        const items = order.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            weight: item.product.weight || 1,
            dimensions: item.product.dimensions || {}
        }));

        // Calculer le poids total
        const totalWeight = items.reduce((sum, item) => 
            sum + (item.weight * item.quantity), 0);

        const deliveryData = {
            order: orderId,
            customer: order.customer._id,
            driver: {
                name: driverName,
                phone: driverPhone
            },
            addresses: {
                pickup: {
                    street: '123 Entrepôt Mireb',
                    city: 'Paris',
                    postalCode: '75001',
                    country: 'France'
                },
                delivery: deliveryAddress
            },
            scheduledDate: new Date(scheduledDate),
            items,
            weight: {
                total: totalWeight
            },
            priority,
            notes: notes ? [{ content: notes, createdBy: 'system' }] : []
        };

        const delivery = new Delivery(deliveryData);
        
        // Calculer les coûts et la durée estimée
        delivery.calculateCost();
        delivery.estimateDeliveryTime();
        
        // Ajouter l'événement de suivi initial
        delivery.addTrackingEvent('pending', 'Entrepôt Mireb', 'Livraison créée et en attente de traitement');
        
        await delivery.save();

        // Mettre à jour le statut de la commande
        order.status = 'processing';
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Livraison créée avec succès',
            data: delivery
        });
    } catch (error) {
        console.error('Erreur createDelivery:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de la livraison',
            error: error.message
        });
    }
};

// Mettre à jour le statut d'une livraison
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const { status, location, description, coordinates } = req.body;

        const delivery = await Delivery.findOne({ trackingNumber })
            .populate('order customer');

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Livraison non trouvée'
            });
        }

        // Ajouter l'événement de suivi
        await delivery.addTrackingEvent(status, location, description, coordinates);

        // Si la livraison est terminée, calculer la durée réelle
        if (status === 'delivered' && delivery.scheduledDate) {
            const actualDuration = Math.floor(
                (new Date() - delivery.scheduledDate) / (1000 * 60)
            );
            delivery.actualDuration = actualDuration;
            await delivery.save();
        }

        res.json({
            success: true,
            message: 'Statut de livraison mis à jour',
            data: delivery
        });
    } catch (error) {
        console.error('Erreur updateDeliveryStatus:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};

// Suivre une livraison
exports.trackDelivery = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const delivery = await Delivery.findOne({ trackingNumber })
            .populate('order', 'orderNumber totalAmount')
            .populate('customer', 'firstName lastName email phone')
            .select('trackingNumber status scheduledDate deliveredDate tracking addresses estimatedDuration');

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Numéro de suivi invalide'
            });
        }

        // Calculer le temps restant estimé
        let estimatedTimeLeft = null;
        if (delivery.status !== 'delivered' && delivery.scheduledDate) {
            const now = new Date();
            const scheduledTime = new Date(delivery.scheduledDate);
            estimatedTimeLeft = Math.max(0, scheduledTime - now);
        }

        res.json({
            success: true,
            data: {
                trackingNumber: delivery.trackingNumber,
                status: delivery.status,
                statusText: delivery.statusText,
                scheduledDate: delivery.scheduledDate,
                deliveredDate: delivery.deliveredDate,
                estimatedTimeLeft,
                estimatedDuration: delivery.estimatedDuration,
                tracking: delivery.tracking,
                addresses: delivery.addresses,
                order: delivery.order,
                customer: {
                    name: `${delivery.customer.firstName} ${delivery.customer.lastName}`,
                    phone: delivery.customer.phone
                }
            }
        });
    } catch (error) {
        console.error('Erreur trackDelivery:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du suivi de la livraison',
            error: error.message
        });
    }
};

// Ajouter une tentative de livraison échouée
exports.addDeliveryAttempt = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const { reason, nextAttemptDate, notes } = req.body;

        const delivery = await Delivery.findOne({ trackingNumber });
        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Livraison non trouvée'
            });
        }

        await delivery.addDeliveryAttempt(reason, new Date(nextAttemptDate), notes);

        res.json({
            success: true,
            message: 'Tentative de livraison enregistrée',
            data: delivery
        });
    } catch (error) {
        console.error('Erreur addDeliveryAttempt:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'enregistrement de la tentative',
            error: error.message
        });
    }
};

// Obtenir les statistiques des livraisons
exports.getDeliveryStats = async (req, res) => {
    try {
        const { period = 30, driver } = req.query;
        
        const stats = await Delivery.getDeliveryStats(parseInt(period));
        
        // Statistiques par livreur si spécifié
        let driverStats = null;
        if (driver) {
            driverStats = await Delivery.getDriverStats(driver, parseInt(period));
        }

        // Performances de livraison
        const performanceStats = await Delivery.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { 
                        $gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000) 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgDeliveryTime: { $avg: '$actualDuration' },
                    avgCost: { $avg: '$cost.total' },
                    totalRevenue: { $sum: '$cost.total' },
                    onTimeDeliveries: {
                        $sum: {
                            $cond: [
                                { $lte: ['$deliveredDate', '$scheduledDate'] },
                                1,
                                0
                            ]
                        }
                    },
                    totalDeliveries: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: stats,
                driver: driverStats,
                performance: performanceStats[0] || {},
                period: parseInt(period)
            }
        });
    } catch (error) {
        console.error('Erreur getDeliveryStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};

// Obtenir les livraisons par livreur
exports.getDeliveriesByDriver = async (req, res) => {
    try {
        const { driver } = req.params;
        const { date, status } = req.query;

        const query = { 'driver.name': driver };
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            
            query.scheduledDate = {
                $gte: startDate,
                $lt: endDate
            };
        }
        
        if (status) {
            query.status = status;
        }

        const deliveries = await Delivery.find(query)
            .populate('order', 'orderNumber')
            .populate('customer', 'firstName lastName phone')
            .sort({ scheduledDate: 1 });

        res.json({
            success: true,
            data: deliveries
        });
    } catch (error) {
        console.error('Erreur getDeliveriesByDriver:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des livraisons du livreur',
            error: error.message
        });
    }
};

// Calculer l'itinéraire optimal pour un livreur
exports.optimizeRoute = async (req, res) => {
    try {
        const { driver, date } = req.body;

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const deliveries = await Delivery.find({
            'driver.name': driver,
            scheduledDate: { $gte: startDate, $lt: endDate },
            status: { $in: ['pending', 'processing', 'shipped'] }
        }).populate('customer', 'firstName lastName phone');

        // Algorithme simple d'optimisation (en production, utiliser Google Maps API)
        const optimizedRoute = deliveries.sort((a, b) => {
            // Trier par priorité puis par code postal
            if (a.priority !== b.priority) {
                const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.addresses.delivery.postalCode.localeCompare(b.addresses.delivery.postalCode);
        });

        res.json({
            success: true,
            message: 'Itinéraire optimisé calculé',
            data: {
                driver,
                date,
                deliveries: optimizedRoute,
                totalDeliveries: optimizedRoute.length,
                estimatedDuration: optimizedRoute.reduce((sum, d) => sum + (d.estimatedDuration || 30), 0)
            }
        });
    } catch (error) {
        console.error('Erreur optimizeRoute:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'optimisation de l\'itinéraire',
            error: error.message
        });
    }
};

module.exports = exports;
