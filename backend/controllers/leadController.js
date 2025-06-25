// Contrôleur pour la gestion des leads CRM
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

// Obtenir tous les leads
exports.getLeads = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            source, 
            status, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            search 
        } = req.query;

        const query = {};
        
        // Filtres
        if (source) query.source = source;
        if (status) query.status = status;
        
        // Recherche
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
            populate: [
                { path: 'assignedTo', select: 'name email' },
                { path: 'convertedTo', select: 'firstName lastName email' }
            ]
        };

        const result = await Lead.paginate(query, options);
        
        res.json({
            success: true,
            data: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalLeads: result.totalDocs,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });
    } catch (error) {
        console.error('Erreur getLeads:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des leads',
            error: error.message
        });
    }
};

// Créer un nouveau lead
exports.createLead = async (req, res) => {
    try {
        const leadData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            source: req.body.source,
            interest: req.body.interest,
            campaignId: req.body.campaignId,
            adSetId: req.body.adSetId,
            tags: req.body.tags || [],
            assignedTo: req.body.assignedTo,
            metadata: req.body.metadata || {}
        };

        const lead = new Lead(leadData);
        
        // Calculer le score initial
        lead.calculateScore();
        
        await lead.save();

        res.status(201).json({
            success: true,
            message: 'Lead créé avec succès',
            data: lead
        });
    } catch (error) {
        console.error('Erreur createLead:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création du lead',
            error: error.message
        });
    }
};

// Mettre à jour un lead
exports.updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const lead = await Lead.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('assignedTo convertedTo');

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead non trouvé'
            });
        }

        // Recalculer le score si nécessaire
        if (updates.source || updates.phone || updates.email || updates.lastContactedAt) {
            lead.calculateScore();
            await lead.save();
        }

        res.json({
            success: true,
            message: 'Lead mis à jour avec succès',
            data: lead
        });
    } catch (error) {
        console.error('Erreur updateLead:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour du lead',
            error: error.message
        });
    }
};

// Ajouter une note à un lead
exports.addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user?.id; // Assuming user is in request from auth middleware

        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead non trouvé'
            });
        }

        await lead.addNote(content, userId);

        res.json({
            success: true,
            message: 'Note ajoutée avec succès',
            data: lead
        });
    } catch (error) {
        console.error('Erreur addNote:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'ajout de la note',
            error: error.message
        });
    }
};

// Convertir un lead en client
exports.convertLead = async (req, res) => {
    try {
        const { id } = req.params;
        const customerData = req.body;

        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead non trouvé'
            });
        }

        if (lead.status === 'converted') {
            return res.status(400).json({
                success: false,
                message: 'Ce lead a déjà été converti'
            });
        }

        const customer = await lead.convertToCustomer(customerData);

        res.json({
            success: true,
            message: 'Lead converti en client avec succès',
            data: {
                lead,
                customer
            }
        });
    } catch (error) {
        console.error('Erreur convertLead:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la conversion du lead',
            error: error.message
        });
    }
};

// Obtenir les statistiques des leads
exports.getLeadStats = async (req, res) => {
    try {
        const { period = 30, source } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.setDate() - parseInt(period));

        // Statistiques générales
        const totalLeads = await Lead.countDocuments();
        const newLeads = await Lead.countDocuments({ 
            createdAt: { $gte: startDate } 
        });

        // Statistiques par statut
        const statsByStatus = await Lead.aggregate([
            { $match: source ? { source } : {} },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$score' }
                }
            }
        ]);

        // Statistiques par source
        const statsBySource = await Lead.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                    converted: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'converted'] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    source: '$_id',
                    count: 1,
                    converted: 1,
                    conversionRate: {
                        $multiply: [
                            { $divide: ['$converted', '$count'] },
                            100
                        ]
                    }
                }
            }
        ]);

        // Taux de conversion global
        const conversionStats = await Lead.getConversionRate(source, parseInt(period));

        // Évolution dans le temps
        const evolution = await Lead.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    ...(source && { source })
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    leads: { $sum: 1 },
                    converted: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'converted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    total: totalLeads,
                    new: newLeads,
                    conversionRate: conversionStats.conversionRate
                },
                byStatus: statsByStatus,
                bySource: statsBySource,
                evolution,
                period: parseInt(period)
            }
        });
    } catch (error) {
        console.error('Erreur getLeadStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};

// Importer des leads depuis les réseaux sociaux
exports.importSocialLeads = async (req, res) => {
    try {
        const { source, leads: importedLeads } = req.body;

        if (!Array.isArray(importedLeads) || importedLeads.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Aucun lead à importer'
            });
        }

        const results = {
            imported: 0,
            duplicates: 0,
            errors: 0,
            details: []
        };

        for (const leadData of importedLeads) {
            try {
                // Vérifier les doublons
                const existingLead = await Lead.findOne({
                    $or: [
                        { email: leadData.email },
                        { phone: leadData.phone }
                    ]
                });

                if (existingLead) {
                    results.duplicates++;
                    results.details.push({
                        email: leadData.email,
                        status: 'duplicate',
                        message: 'Lead déjà existant'
                    });
                    continue;
                }

                // Créer le nouveau lead
                const lead = new Lead({
                    ...leadData,
                    source: source || leadData.source,
                    status: 'new'
                });

                lead.calculateScore();
                await lead.save();

                results.imported++;
                results.details.push({
                    email: leadData.email,
                    status: 'imported',
                    id: lead._id
                });

            } catch (error) {
                results.errors++;
                results.details.push({
                    email: leadData.email,
                    status: 'error',
                    message: error.message
                });
            }
        }

        res.json({
            success: true,
            message: `Import terminé: ${results.imported} leads importés, ${results.duplicates} doublons, ${results.errors} erreurs`,
            data: results
        });

    } catch (error) {
        console.error('Erreur importSocialLeads:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'import des leads',
            error: error.message
        });
    }
};

// Assigner un lead à un utilisateur
exports.assignLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            id,
            { assignedTo },
            { new: true }
        ).populate('assignedTo', 'name email');

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Lead assigné avec succès',
            data: lead
        });
    } catch (error) {
        console.error('Erreur assignLead:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'assignation du lead',
            error: error.message
        });
    }
};

// Supprimer un lead
exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        const lead = await Lead.findByIdAndDelete(id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Lead supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur deleteLead:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du lead',
            error: error.message
        });
    }
};

module.exports = exports;
