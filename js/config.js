// Configuration centralisée pour Mireb B2B Marketplace
// Variables optimisées et organisation modulaire

class MirebConfig {
    constructor() {
        // Configuration générale de l'application
        this.app = {
            name: 'Mireb B2B Marketplace',
            version: '2.0.0',
            environment: 'development', // production, development, test
            baseUrl: window.location.origin,
            apiUrl: '/api',
            defaultLanguage: 'fr',
            timezone: 'Europe/Paris'
        };

        // Configuration API et réseau
        this.api = {
            timeout: 10000,
            maxRetries: 3,
            retryDelay: 1000,
            endpoints: {
                auth: '/api/auth',
                products: '/api/products',
                categories: '/api/categories',
                orders: '/api/orders',
                customers: '/api/customers',
                messages: '/api/messages',
                leads: '/api/leads',
                deliveries: '/api/deliveries',
                users: '/api/users',
                dashboard: '/api/dashboard'
            }
        };

        // Configuration interface utilisateur
        this.ui = {
            theme: 'modern', // modern, classic, dark
            itemsPerPage: 12,
            animationDelay: 100,
            refreshInterval: 30000,
            autoSave: true,
            autoSaveInterval: 30000,
            validationDelay: 300,
            notificationDuration: 5000
        };

        // Configuration des catégories
        this.categories = {
            maxDepth: 3,
            defaultIcon: 'fas fa-folder',
            defaultColor: '#667eea',
            sortOptions: ['name', 'products', 'popularity', 'order'],
            layoutOptions: ['grid', 'list', 'carousel'],
            imageFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxImageSize: 2048000 // 2MB
        };

        // Configuration des produits
        this.products = {
            maxImages: 5,
            imageFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxImageSize: 2048000,
            priceDecimals: 2,
            stockLowThreshold: 5,
            searchFields: ['name', 'description', 'tags', 'sku'],
            sortOptions: ['name', 'price', 'stock', 'created', 'popularity']
        };

        // Configuration CRM
        this.crm = {
            leadSources: ['website', 'facebook', 'instagram', 'google', 'referral', 'direct'],
            leadStatuses: ['nouveau', 'contacté', 'qualifié', 'opportunité', 'converti', 'perdu'],
            priorities: ['faible', 'normale', 'élevée', 'urgente'],
            communicationChannels: ['email', 'phone', 'whatsapp', 'sms', 'meeting'],
            autoFollowUpDays: [1, 3, 7, 14, 30]
        };

        // Configuration des livraisons
        this.deliveries = {
            statuses: ['préparation', 'expédiée', 'en_transit', 'livrée', 'échec'],
            carriers: ['DHL', 'FedEx', 'UPS', 'La Poste', 'Chronopost'],
            trackingProviders: {
                'DHL': 'https://www.dhl.com/track?AWB={trackingNumber}',
                'FedEx': 'https://www.fedex.com/apps/fedextrack/?tracknumbers={trackingNumber}',
                'UPS': 'https://www.ups.com/track?tracknum={trackingNumber}'
            }
        };

        // Configuration marketing et réseaux sociaux
        this.marketing = {
            socialPlatforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
            campaignTypes: ['awareness', 'traffic', 'conversion', 'engagement'],
            audienceTargeting: ['age', 'gender', 'location', 'interests', 'behaviors'],
            budgetRanges: [
                { min: 10, max: 50, label: '10€ - 50€' },
                { min: 50, max: 100, label: '50€ - 100€' },
                { min: 100, max: 500, label: '100€ - 500€' },
                { min: 500, max: 1000, label: '500€ - 1000€' }
            ]
        };

        // Configuration des utilisateurs
        this.users = {
            roles: ['admin', 'manager', 'employee', 'viewer'],
            permissions: {
                admin: ['all'],
                manager: ['products', 'categories', 'orders', 'customers', 'leads'],
                employee: ['products', 'orders', 'customers'],
                viewer: ['view_only']
            },
            sessionTimeout: 3600000, // 1 heure
            passwordMinLength: 8,
            maxLoginAttempts: 5,
            lockoutDuration: 300000 // 5 minutes
        };

        // Configuration des notifications
        this.notifications = {
            types: ['success', 'error', 'warning', 'info'],
            positions: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
            defaultPosition: 'top-right',
            autoClose: true,
            closeDuration: 5000,
            maxNotifications: 5
        };

        // Configuration du cache et performance
        this.cache = {
            enabled: true,
            ttl: 300000, // 5 minutes
            maxSize: 100,
            storageType: 'localStorage', // localStorage, sessionStorage, memory
            prefixKey: 'mireb_cache_'
        };

        // Configuration de sécurité
        this.security = {
            enableCSRF: true,
            enableCORS: true,
            maxRequestSize: 10485760, // 10MB
            allowedOrigins: ['http://localhost:3000', 'https://mireb-marketplace.com'],
            rateLimiting: {
                enabled: true,
                maxRequests: 100,
                timeWindow: 900000 // 15 minutes
            }
        };
    }

    // Obtenir la configuration par section
    getConfig(section) {
        return this[section] || {};
    }

    // Mettre à jour une configuration
    updateConfig(section, updates) {
        if (this[section]) {
            this[section] = { ...this[section], ...updates };
            this.saveToStorage();
        }
    }

    // Sauvegarder la configuration
    saveToStorage() {
        try {
            localStorage.setItem('mireb_config', JSON.stringify({
                app: this.app,
                ui: this.ui,
                api: this.api
            }));
        } catch (error) {
            console.warn('Erreur sauvegarde configuration:', error);
        }
    }

    // Charger la configuration depuis le stockage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('mireb_config');
            if (stored) {
                const config = JSON.parse(stored);
                Object.keys(config).forEach(section => {
                    if (this[section]) {
                        this[section] = { ...this[section], ...config[section] };
                    }
                });
            }
        } catch (error) {
            console.warn('Erreur chargement configuration:', error);
        }
    }

    // Réinitialiser la configuration
    reset() {
        localStorage.removeItem('mireb_config');
        location.reload();
    }

    // Obtenir l'URL complète d'un endpoint API
    getApiUrl(endpoint) {
        const baseUrl = this.api.endpoints[endpoint] || endpoint;
        return this.app.baseUrl + baseUrl;
    }

    // Valider la configuration
    validate() {
        const errors = [];

        // Validation de base
        if (!this.app.name) errors.push('Nom de l\'application requis');
        if (!this.app.baseUrl) errors.push('URL de base requise');
        if (this.ui.itemsPerPage < 1) errors.push('Items par page doit être > 0');
        if (this.api.timeout < 1000) errors.push('Timeout trop faible');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Obtenir les statistiques de configuration
    getStats() {
        return {
            totalSections: Object.keys(this).filter(key => typeof this[key] === 'object').length,
            totalEndpoints: Object.keys(this.api.endpoints).length,
            cacheEnabled: this.cache.enabled,
            environment: this.app.environment,
            version: this.app.version
        };
    }
}

// Instance globale de configuration
window.MirebConfig = new MirebConfig();

// Charger la configuration sauvegardée
window.MirebConfig.loadFromStorage();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MirebConfig;
}

// Debug en développement
if (window.MirebConfig.app.environment === 'development') {
    console.log('🔧 Configuration Mireb chargée:', window.MirebConfig.getStats());
}
