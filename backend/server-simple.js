// Serveur backend simplifié pour Mireb B2B
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../')));

// Données en mémoire pour les tests
let messages = [];
let products = [];
let categories = [];

// Routes de base
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Serveur Mireb B2B fonctionnel', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Route pour les messages de contact
app.post('/api/contact', (req, res) => {
    try {
        const { nom, email, sujet, message } = req.body;

        // Validation simple
        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Créer le message
        const newMessage = {
            id: Date.now(),
            customerName: nom,
            customerEmail: email,
            subject: sujet,
            content: message,
            status: 'nouveau',
            createdAt: new Date().toISOString(),
            source: 'website-contact-form'
        };

        messages.push(newMessage);

        console.log('📧 Nouveau message reçu:', {
            de: email,
            sujet: sujet,
            id: newMessage.id
        });

        res.json({
            success: true,
            message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            messageId: newMessage.id
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de l\'envoi de votre message.'
        });
    }
});

// Routes pour les messages (admin)
app.get('/api/messages', (req, res) => {
    res.json({
        success: true,
        data: {
            messages: messages.reverse(),
            totalMessages: messages.length
        }
    });
});

// Routes pour les produits
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: products
    });
});

app.post('/api/products', (req, res) => {
    const newProduct = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.json({
        success: true,
        message: 'Produit créé avec succès',
        data: newProduct
    });
});

// Routes pour les catégories
app.get('/api/categories', (req, res) => {
    res.json({
        success: true,
        data: categories
    });
});

app.post('/api/categories', (req, res) => {
    const newCategory = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    
    res.json({
        success: true,
        message: 'Catégorie créée avec succès',
        data: newCategory
    });
});

// Route pour les statistiques
app.get('/api/dashboard/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalMessages: messages.length,
            newMessages: messages.filter(m => m.status === 'nouveau').length,
            totalProducts: products.length,
            totalCategories: categories.length,
            recentMessages: messages.slice(-5).reverse()
        }
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            message: 'Endpoint non trouvé',
            path: req.path
        });
    } else {
        res.sendFile(path.join(__dirname, '../index.html'));
    }
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('🚀 ========================================');
    console.log(`🌐 Serveur Mireb B2B démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
    console.log(`🏠 Site web : http://localhost:${PORT}`);
    console.log(`👨‍💼 Interface admin : http://localhost:${PORT}/admin.html`);
    console.log(`📞 Page contact : http://localhost:${PORT}/contact.html`);
    console.log('🚀 ========================================');
    
    // Données de test
    console.log('💡 Initialisation des données de test...');
    
    // Ajouter quelques messages de test
    messages.push({
        id: 1,
        customerName: 'Jean Dupont',
        customerEmail: 'jean.dupont@exemple.com',
        subject: 'Demande d\'information produits',
        content: 'Bonjour, je souhaiterais avoir plus d\'informations sur vos produits électroniques.',
        status: 'nouveau',
        createdAt: new Date().toISOString(),
        source: 'website-contact-form'
    });
    
    console.log('✅ Serveur prêt pour les tests !');
});

module.exports = app;
