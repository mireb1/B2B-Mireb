// Modèle Lead pour le CRM
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    source: {
        type: String,
        enum: ['Facebook', 'Instagram', 'LinkedIn', 'Website', 'Referral', 'Other'],
        required: true
    },
    interest: {
        type: String,
        trim: true
    },
    campaignId: {
        type: String,
        trim: true
    },
    adSetId: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
        default: 'new'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [{
        content: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [String],
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    convertedAt: Date,
    convertedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    lastContactedAt: Date,
    nextFollowUpAt: Date,
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour optimiser les recherches
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ source: 1, status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ score: -1 });

// Virtuel pour calculer l'âge du lead
leadSchema.virtual('ageInDays').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Méthode pour calculer le score du lead
leadSchema.methods.calculateScore = function() {
    let score = 0;
    
    // Score basé sur la source
    const sourceScores = {
        'Facebook': 20,
        'Instagram': 15,
        'LinkedIn': 25,
        'Website': 30,
        'Referral': 35,
        'Other': 10
    };
    score += sourceScores[this.source] || 0;
    
    // Score basé sur l'engagement
    if (this.phone) score += 15;
    if (this.email) score += 10;
    if (this.interest) score += 10;
    
    // Score basé sur l'activité récente
    if (this.lastContactedAt) {
        const daysSinceContact = (Date.now() - this.lastContactedAt) / (1000 * 60 * 60 * 24);
        if (daysSinceContact < 7) score += 20;
        else if (daysSinceContact < 30) score += 10;
    }
    
    // Score basé sur les notes d'interaction
    score += Math.min(this.notes.length * 5, 20);
    
    this.score = Math.min(score, 100);
    return this.score;
};

// Méthode pour ajouter une note
leadSchema.methods.addNote = function(content, userId) {
    this.notes.push({
        content,
        createdBy: userId,
        createdAt: new Date()
    });
    this.lastContactedAt = new Date();
    return this.save();
};

// Méthode pour convertir en client
leadSchema.methods.convertToCustomer = async function(customerData) {
    const Customer = mongoose.model('Customer');
    
    const customer = new Customer({
        ...customerData,
        firstName: this.name.split(' ')[0],
        lastName: this.name.split(' ').slice(1).join(' '),
        email: this.email,
        phone: this.phone,
        source: this.source,
        leadId: this._id
    });
    
    await customer.save();
    
    this.status = 'converted';
    this.convertedAt = new Date();
    this.convertedTo = customer._id;
    await this.save();
    
    return customer;
};

// Méthodes statiques
leadSchema.statics.getLeadsBySource = function(source, startDate, endDate) {
    const query = { source };
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    return this.find(query).sort({ createdAt: -1 });
};

leadSchema.statics.getConversionRate = async function(source, period) {
    const match = {};
    if (source) match.source = source;
    
    if (period) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - period);
        match.createdAt = { $gte: startDate };
    }
    
    const result = await this.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                converted: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'converted'] }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                conversionRate: {
                    $multiply: [
                        { $divide: ['$converted', '$total'] },
                        100
                    ]
                },
                total: 1,
                converted: 1
            }
        }
    ]);
    
    return result[0] || { conversionRate: 0, total: 0, converted: 0 };
};

module.exports = mongoose.model('Lead', leadSchema);
