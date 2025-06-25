// Routes pour la gestion des messages de contact
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const adminAuth = require('../middleware/adminAuth');

// Envoyer un nouveau message de contact
router.post('/', async (req, res) => {
    try {
        const { nom, email, sujet, message, source = 'website-contact-form' } = req.body;

        // Validation des données
        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        // Créer le message
        const newMessage = new Message({
            customerName: nom,
            customerEmail: email,
            subject: sujet,
            content: message,
            source: source,
            status: 'nouveau',
            metadata: {
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                timestamp: new Date()
            }
        });

        await newMessage.save();

        // Envoyer une notification (optionnel)
        // await sendNotificationEmail(newMessage);

        res.json({
            success: true,
            message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            messageId: newMessage._id
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.'
        });
    }
});

// Obtenir tous les messages (admin uniquement)
router.get('/', adminAuth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            search 
        } = req.query;

        const query = {};
        
        // Filtres
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { customerEmail: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Options de tri
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Pagination
        const skip = (page - 1) * limit;

        const messages = await Message.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('assignedTo', 'name email');

        const totalMessages = await Message.countDocuments(query);
        const totalPages = Math.ceil(totalMessages / limit);

        res.json({
            success: true,
            data: {
                messages,
                currentPage: parseInt(page),
                totalPages,
                totalMessages,
                hasMore: page < totalPages
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des messages'
        });
    }
});

// Mettre à jour le statut d'un message (admin uniquement)
router.put('/:id/status', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé'
            });
        }

        message.status = status;
        if (response) {
            message.adminResponse = response;
            message.respondedAt = new Date();
            message.respondedBy = req.user._id;
        }

        await message.save();

        res.json({
            success: true,
            message: 'Statut du message mis à jour',
            data: message
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du message:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du message'
        });
    }
});

// Supprimer un message (admin uniquement)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé'
            });
        }

        await Message.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Message supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du message'
        });
    }
});

// Obtenir les statistiques des messages (admin uniquement)
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalMessages = await Message.countDocuments();
        const newMessages = await Message.countDocuments({ status: 'nouveau' });
        const inProgressMessages = await Message.countDocuments({ status: 'en_cours' });
        const resolvedMessages = await Message.countDocuments({ status: 'resolu' });

        // Messages par jour (7 derniers jours)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyMessages = await Message.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // Sources des messages
        const messagesBySource = await Message.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    total: totalMessages,
                    nouveau: newMessages,
                    en_cours: inProgressMessages,
                    resolu: resolvedMessages
                },
                dailyMessages,
                messagesBySource
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
});

module.exports = router;
