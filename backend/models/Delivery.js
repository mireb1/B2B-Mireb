// Modèle Livraison
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'failed', 'returned'],
        default: 'pending'
    },
    driver: {
        name: String,
        phone: String,
        vehicle: String,
        licensePlate: String
    },
    addresses: {
        pickup: {
            street: String,
            city: String,
            postalCode: String,
            country: { type: String, default: 'France' },
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        delivery: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, default: 'France' },
            instructions: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        }
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    deliveredDate: Date,
    estimatedDuration: Number, // en minutes
    actualDuration: Number, // en minutes
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        quantity: Number,
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        }
    }],
    weight: {
        total: Number, // en kg
        volumetric: Number // poids volumétrique
    },
    cost: {
        base: Number,
        fuel: Number,
        distance: Number,
        special: Number, // frais spéciaux
        total: Number
    },
    distance: Number, // en km
    notes: [{
        content: String,
        type: {
            type: String,
            enum: ['info', 'warning', 'error', 'success']
        },
        createdBy: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    signature: {
        recipientName: String,
        signatureUrl: String,
        photoUrl: String,
        timestamp: Date
    },
    tracking: [{
        status: String,
        location: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        description: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    }],
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    attempts: [{
        attemptNumber: Number,
        date: Date,
        reason: String,
        nextAttemptDate: Date,
        notes: String
    }],
    returnReason: String,
    refundRequested: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour optimiser les recherches
deliverySchema.index({ trackingNumber: 1 });
deliverySchema.index({ order: 1 });
deliverySchema.index({ customer: 1 });
deliverySchema.index({ status: 1, scheduledDate: 1 });
deliverySchema.index({ 'driver.name': 1, status: 1 });

// Générer automatiquement un numéro de suivi
deliverySchema.pre('save', async function(next) {
    if (this.isNew && !this.trackingNumber) {
        const count = await this.constructor.countDocuments();
        this.trackingNumber = `MRB${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Virtuel pour calculer le délai de livraison
deliverySchema.virtual('deliveryDelay').get(function() {
    if (this.deliveredDate && this.scheduledDate) {
        return Math.floor((this.deliveredDate - this.scheduledDate) / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Virtuel pour le statut en français
deliverySchema.virtual('statusText').get(function() {
    const statusMap = {
        'pending': 'En attente',
        'processing': 'En préparation',
        'shipped': 'Expédiée',
        'out_for_delivery': 'En cours de livraison',
        'delivered': 'Livrée',
        'failed': 'Échec',
        'returned': 'Retournée'
    };
    return statusMap[this.status] || this.status;
});

// Méthode pour ajouter un événement de suivi
deliverySchema.methods.addTrackingEvent = function(status, location, description, coordinates) {
    this.tracking.push({
        status,
        location,
        description,
        coordinates,
        timestamp: new Date()
    });
    
    // Mettre à jour le statut principal si nécessaire
    if (this.status !== status) {
        this.status = status;
        
        // Si livré, enregistrer la date
        if (status === 'delivered') {
            this.deliveredDate = new Date();
        }
    }
    
    return this.save();
};

// Méthode pour calculer les coûts de livraison
deliverySchema.methods.calculateCost = function() {
    let baseCost = 5.00; // coût de base
    
    // Coût basé sur la distance
    const distanceCost = (this.distance || 0) * 0.5;
    
    // Coût basé sur le poids
    const weightCost = (this.weight?.total || 0) * 1.0;
    
    // Coût de carburant (fixe pour simplifier)
    const fuelCost = 2.00;
    
    // Frais spéciaux pour livraison urgente
    let specialCost = 0;
    if (this.priority === 'urgent') {
        specialCost = 15.00;
    } else if (this.priority === 'high') {
        specialCost = 8.00;
    }
    
    this.cost = {
        base: baseCost,
        fuel: fuelCost,
        distance: distanceCost,
        special: specialCost,
        total: baseCost + fuelCost + distanceCost + specialCost + weightCost
    };
    
    return this.cost.total;
};

// Méthode pour estimer la durée de livraison
deliverySchema.methods.estimateDeliveryTime = function() {
    // Durée de base : 30 minutes
    let duration = 30;
    
    // Ajouter du temps basé sur la distance (2 min par km)
    duration += (this.distance || 0) * 2;
    
    // Ajouter du temps pour les gros colis
    if (this.weight?.total > 10) {
        duration += 15;
    }
    
    // Réduire pour livraison prioritaire
    if (this.priority === 'urgent') {
        duration *= 0.8;
    }
    
    this.estimatedDuration = Math.round(duration);
    return this.estimatedDuration;
};

// Méthode pour ajouter une tentative de livraison
deliverySchema.methods.addDeliveryAttempt = function(reason, nextAttemptDate, notes) {
    const attemptNumber = this.attempts.length + 1;
    
    this.attempts.push({
        attemptNumber,
        date: new Date(),
        reason,
        nextAttemptDate,
        notes
    });
    
    // Mettre à jour le statut
    this.status = 'pending';
    this.scheduledDate = nextAttemptDate;
    
    // Ajouter un événement de suivi
    this.addTrackingEvent('failed', 'Centre de livraison', `Tentative ${attemptNumber} échouée: ${reason}`);
    
    return this.save();
};

// Méthodes statiques
deliverySchema.statics.getDeliveriesByStatus = function(status, startDate, endDate) {
    const query = { status };
    if (startDate || endDate) {
        query.scheduledDate = {};
        if (startDate) query.scheduledDate.$gte = new Date(startDate);
        if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }
    return this.find(query).populate('order customer').sort({ scheduledDate: 1 });
};

deliverySchema.statics.getDeliveryStats = async function(period = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    
    const stats = await this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgDuration: { $avg: '$actualDuration' },
                totalCost: { $sum: '$cost.total' }
            }
        }
    ]);
    
    const deliveryRate = await this.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                delivered: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0]
                    }
                },
                onTime: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$status', 'delivered'] },
                                    { $lte: ['$deliveredDate', '$scheduledDate'] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);
    
    return {
        byStatus: stats,
        rates: deliveryRate[0] || { total: 0, delivered: 0, onTime: 0 }
    };
};

deliverySchema.statics.getDriverStats = function(driverName, period = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    
    return this.aggregate([
        {
            $match: {
                'driver.name': driverName,
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalDistance: { $sum: '$distance' },
                totalRevenue: { $sum: '$cost.total' }
            }
        }
    ]);
};

module.exports = mongoose.model('Delivery', deliverySchema);
