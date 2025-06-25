// Configuration pour les intégrations réseaux sociaux et marketing
// Ce fichier contient les paramètres pour Facebook, Instagram, WhatsApp, etc.

const SOCIAL_CONFIG = {
    // Configuration Facebook
    facebook: {
        appId: 'YOUR_FACEBOOK_APP_ID',
        pageId: 'YOUR_FACEBOOK_PAGE_ID',
        accessToken: 'YOUR_FACEBOOK_ACCESS_TOKEN',
        leadFormIds: {
            general: 'YOUR_LEAD_FORM_ID',
            electronics: 'YOUR_ELECTRONICS_FORM_ID',
            fashion: 'YOUR_FASHION_FORM_ID'
        }
    },

    // Configuration Instagram
    instagram: {
        businessId: 'YOUR_INSTAGRAM_BUSINESS_ID',
        accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN',
        webhookToken: 'YOUR_WEBHOOK_VERIFY_TOKEN'
    },

    // Configuration WhatsApp Business
    whatsapp: {
        businessId: 'YOUR_WHATSAPP_BUSINESS_ID',
        phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
        accessToken: 'YOUR_WHATSAPP_ACCESS_TOKEN',
        webhookToken: 'YOUR_WHATSAPP_WEBHOOK_TOKEN',
        templates: {
            welcome: 'hello_world',
            orderConfirmation: 'order_confirmation',
            deliveryUpdate: 'delivery_update'
        }
    },

    // Configuration SMS (Twilio par exemple)
    sms: {
        accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
        authToken: 'YOUR_TWILIO_AUTH_TOKEN',
        fromNumber: '+33123456789'
    },

    // Configuration pour les appels (Twilio Voice)
    voice: {
        accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
        authToken: 'YOUR_TWILIO_AUTH_TOKEN',
        fromNumber: '+33123456789'
    },

    // URLs des webhooks
    webhooks: {
        facebook: '/api/webhooks/facebook',
        instagram: '/api/webhooks/instagram',
        whatsapp: '/api/webhooks/whatsapp'
    }
};

// Fonctions utilitaires pour les intégrations
const SocialIntegrations = {
    
    // Synchroniser les leads Facebook
    async syncFacebookLeads() {
        if (!SOCIAL_CONFIG.facebook.accessToken) {
            console.warn('Token Facebook non configuré');
            return [];
        }

        try {
            // Simulation d'appel API Facebook
            // En production, utiliser l'API Facebook Lead Ads
            const response = await fetch(`https://graph.facebook.com/v18.0/${SOCIAL_CONFIG.facebook.pageId}/leadgen_forms`, {
                headers: {
                    'Authorization': `Bearer ${SOCIAL_CONFIG.facebook.accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return this.processFacebookLeads(data.data || []);
            }
        } catch (error) {
            console.error('Erreur sync Facebook:', error);
        }

        // En attendant les vraies intégrations, retourner des données simulées
        return this.getMockFacebookLeads();
    },

    // Synchroniser les leads Instagram
    async syncInstagramLeads() {
        if (!SOCIAL_CONFIG.instagram.accessToken) {
            console.warn('Token Instagram non configuré');
            return [];
        }

        // Simulation - en production utiliser Instagram Basic Display API
        return this.getMockInstagramLeads();
    },

    // Publier sur les réseaux sociaux
    async publishToSocial(content, platforms, imageUrl = null) {
        const results = {};

        for (const platform of platforms) {
            try {
                switch (platform.toLowerCase()) {
                    case 'facebook':
                        results.facebook = await this.publishToFacebook(content, imageUrl);
                        break;
                    case 'instagram':
                        results.instagram = await this.publishToInstagram(content, imageUrl);
                        break;
                    case 'linkedin':
                        results.linkedin = await this.publishToLinkedIn(content, imageUrl);
                        break;
                }
            } catch (error) {
                console.error(`Erreur publication ${platform}:`, error);
                results[platform] = { success: false, error: error.message };
            }
        }

        return results;
    },

    // Envoyer un SMS
    async sendSMS(to, message) {
        if (!SOCIAL_CONFIG.sms.accountSid) {
            console.warn('Configuration SMS non disponible');
            return { success: false, error: 'Configuration manquante' };
        }

        try {
            // En production, utiliser Twilio SMS API
            // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json', {...});
            
            // Simulation pour le développement
            console.log(`SMS simulé vers ${to}: ${message}`);
            return { 
                success: true, 
                sid: 'SM' + Date.now(),
                message: 'SMS envoyé avec succès (simulation)'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Envoyer un message WhatsApp
    async sendWhatsApp(to, message, templateName = null) {
        if (!SOCIAL_CONFIG.whatsapp.accessToken) {
            console.warn('Configuration WhatsApp non disponible');
            return { success: false, error: 'Configuration manquante' };
        }

        try {
            // En production, utiliser WhatsApp Business API
            const url = `https://graph.facebook.com/v18.0/${SOCIAL_CONFIG.whatsapp.phoneNumberId}/messages`;
            
            const payload = {
                messaging_product: 'whatsapp',
                to: to.replace(/[^0-9]/g, ''),
                type: 'text',
                text: { body: message }
            };

            // Simulation
            console.log(`WhatsApp simulé vers ${to}: ${message}`);
            return { 
                success: true, 
                messageId: 'WA' + Date.now(),
                message: 'Message WhatsApp envoyé (simulation)'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Lancer un appel
    async makeCall(to, from = null) {
        const fromNumber = from || SOCIAL_CONFIG.voice.fromNumber;
        
        if (!SOCIAL_CONFIG.voice.accountSid) {
            console.warn('Configuration d\'appel non disponible');
            // Utiliser le protocole tel: pour les appels locaux
            window.open(`tel:${to}`);
            return { success: true, type: 'local', message: 'Appel local initié' };
        }

        try {
            // En production, utiliser Twilio Voice API pour les appels automatisés
            console.log(`Appel simulé de ${fromNumber} vers ${to}`);
            return { 
                success: true, 
                callSid: 'CA' + Date.now(),
                type: 'cloud',
                message: 'Appel cloud initié (simulation)'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Données simulées pour le développement
    getMockFacebookLeads() {
        return [
            {
                id: Date.now(),
                name: 'Pierre Dubois',
                email: 'pierre.dubois@email.com',
                phone: '+33123123123',
                source: 'Facebook',
                interest: 'Électronique',
                status: 'new',
                created_time: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                name: 'Julie Lambert',
                email: 'julie.lambert@email.com',
                phone: '+33456456456',
                source: 'Facebook',
                interest: mode,
                status: 'new',
                created_time: new Date().toISOString()
            }
        ];
    },

    getMockInstagramLeads() {
        return [
            {
                id: Date.now() + 2,
                name: 'Thomas Martin',
                email: 'thomas.martin@email.com',
                phone: '+33789789789',
                source: 'Instagram',
                interest: 'Maison',
                status: 'new',
                created_time: new Date().toISOString()
            }
        ];
    },

    // Traitement des leads Facebook
    processFacebookLeads(rawLeads) {
        return rawLeads.map(lead => ({
            id: lead.id,
            name: lead.field_data?.find(f => f.name === 'full_name')?.values?.[0] || 'Nom inconnu',
            email: lead.field_data?.find(f => f.name === 'email')?.values?.[0] || '',
            phone: lead.field_data?.find(f => f.name === 'phone_number')?.values?.[0] || '',
            source: 'Facebook',
            interest: lead.ad_name || 'Général',
            status: 'new',
            created_time: lead.created_time
        }));
    },

    // Publication Facebook (simulation)
    async publishToFacebook(content, imageUrl) {
        console.log('Publication Facebook:', { content, imageUrl });
        return { success: true, postId: 'FB' + Date.now() };
    },

    // Publication Instagram (simulation)
    async publishToInstagram(content, imageUrl) {
        console.log('Publication Instagram:', { content, imageUrl });
        return { success: true, postId: 'IG' + Date.now() };
    },

    // Publication LinkedIn (simulation)
    async publishToLinkedIn(content, imageUrl) {
        console.log('Publication LinkedIn:', { content, imageUrl });
        return { success: true, postId: 'LI' + Date.now() };
    }
};

// Gestionnaire de tunnel de vente
const SalesFunnel = {
    stages: [
        { name: 'Sensibilisation', conversion: 100 },
        { name: 'Intérêt', conversion: 15 },
        { name: 'Considération', conversion: 8 },
        { name: 'Conversion', conversion: 3 }
    ],

    // Calculer les métriques du tunnel
    calculateMetrics(visitors = 1000) {
        const metrics = {};
        let currentVisitors = visitors;

        this.stages.forEach((stage, index) => {
            if (index === 0) {
                metrics[stage.name] = currentVisitors;
            } else {
                currentVisitors = Math.floor(currentVisitors * (stage.conversion / 100));
                metrics[stage.name] = currentVisitors;
            }
        });

        return metrics;
    },

    // Optimiser le tunnel
    suggestOptimizations() {
        return [
            {
                stage: 'Sensibilisation',
                suggestion: 'Augmenter la portée des publications sociales',
                impact: 'high'
            },
            {
                stage: 'Intérêt',
                suggestion: 'Créer du contenu éducatif',
                impact: 'medium'
            },
            {
                stage: 'Considération',
                suggestion: 'Proposer des démos produits',
                impact: 'high'
            },
            {
                stage: 'Conversion',
                suggestion: 'Simplifier le processus de commande',
                impact: 'critical'
            }
        ];
    }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SOCIAL_CONFIG, SocialIntegrations, SalesFunnel };
}
