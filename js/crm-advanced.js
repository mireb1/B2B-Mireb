// CRM avancé avec intégrations locales pour Mireb Commercial
// Fonctionnalités: Appels, WhatsApp, SMS, Leads Facebook/Instagram

class CRMManager {
    constructor() {
        this.clients = [
            {
                id: 1,
                firstname: 'Jean',
                lastname: 'Dupont',
                email: 'jean.dupont@email.com',
                phone: '+33123456789',
                whatsapp: '+33123456789',
                company: 'Tech Solutions SARL',
                position: 'Directeur Commercial',
                status: 'active',
                segment: 'vip',
                city: 'Paris',
                address: '123 Rue de la République',
                postal: '75001',
                country: 'France',
                website: 'https://techsolutions.fr',
                notes: 'Client fidèle depuis 2 ans, commandes régulières',
                tags: ['VIP', 'Fidèle', 'Entreprise'],
                orders: 15,
                totalValue: 2500.00,
                averageOrderValue: 166.67,
                lastActivity: '2025-06-20T10:30:00',
                lastOrderDate: '2025-06-15T14:20:00',
                acquisitionChannel: 'Website',
                birthday: '1985-03-15',
                preferences: {
                    contactMethod: 'email',
                    language: 'fr',
                    categories: ['Électronique', 'Informatique']
                },
                socialProfiles: {
                    facebook: 'jean.dupont.profile',
                    linkedin: 'jean-dupont-tech'
                },
                customFields: {
                    budget_annuel: '50000',
                    secteur_activite: 'IT',
                    nb_employes: '25'
                },
                createdAt: '2023-01-15T09:00:00'
            },
            {
                id: 2,
                firstname: 'Marie',
                lastname: 'Martin',
                email: 'marie.martin@email.com',
                phone: '+33987654321',
                whatsapp: '+33987654321',
                company: 'Design Studio Pro',
                position: 'Directrice Créative',
                status: 'vip',
                segment: 'premium',
                city: 'Lyon',
                address: '456 Avenue des Arts',
                postal: '69000',
                country: 'France',
                website: 'https://designstudio.com',
                notes: 'Intéressée par les nouveautés design et tech',
                tags: ['VIP', 'Designer', 'Créative'],
                orders: 28,
                totalValue: 4200.00,
                averageOrderValue: 150.00,
                lastActivity: '2025-06-22T16:45:00',
                lastOrderDate: '2025-06-20T11:30:00',
                acquisitionChannel: 'Instagram',
                birthday: '1988-07-22',
                preferences: {
                    contactMethod: 'whatsapp',
                    language: 'fr',
                    categories: ['Design', 'Mode', 'Décoration']
                },
                socialProfiles: {
                    instagram: '@mariedesign_pro',
                    behance: 'marie-martin-design'
                },
                customFields: {
                    budget_annuel: '75000',
                    secteur_activite: 'Design',
                    nb_employes: '8'
                },
                createdAt: '2023-03-20T14:30:00'
            }
        ];

        this.leads = [
            {
                id: 1,
                name: 'Sophie Laurent',
                email: 'sophie.laurent@email.com',
                phone: '+33555666777',
                company: 'Startup Innovation',
                source: 'Facebook',
                campaign: 'Été 2025 - Électronique',
                interest: 'Ordinateurs portables',
                status: 'new',
                score: 75,
                temperature: 'hot',
                assignedTo: 2, // Sophie (sales_manager)
                notes: 'Intéressée par les offres pro, budget 10k€',
                tags: ['Hot Lead', 'B2B', 'High Budget'],
                lastContact: null,
                nextAction: 'Appel de qualification',
                nextActionDate: '2025-06-26T10:00:00',
                socialProfile: {
                    platform: 'facebook',
                    profileId: 'sophie.laurent.123',
                    profileUrl: 'https://facebook.com/sophie.laurent.123'
                },
                utm: {
                    source: 'facebook',
                    medium: 'social',
                    campaign: 'summer_electronics_2025',
                    content: 'laptop_promo'
                },
                customFields: {
                    budget: '10000',
                    timeline: '1 month',
                    decision_maker: 'yes'
                },
                createdAt: '2025-06-24T09:15:00'
            },
            {
                id: 2,
                name: 'Thomas Morel',
                email: 'thomas.morel@email.com',
                phone: '+33444333222',
                company: 'Retail Plus',
                source: 'Instagram',
                campaign: 'Mode Été 2025',
                interest: 'Collection mode été',
                status: 'qualified',
                score: 85,
                temperature: 'hot',
                assignedTo: 2,
                notes: 'Boutique physique, cherche fournisseur régulier',
                tags: ['Qualified', 'Retailer', 'Recurring Business'],
                lastContact: '2025-06-23T14:30:00',
                nextAction: 'Présentation catalogue',
                nextActionDate: '2025-06-27T15:00:00',
                socialProfile: {
                    platform: 'instagram',
                    profileId: 'thomas_retail_plus',
                    profileUrl: 'https://instagram.com/thomas_retail_plus'
                },
                utm: {
                    source: 'instagram',
                    medium: 'social',
                    campaign: 'fashion_summer_2025',
                    content: 'story_ad'
                },
                customFields: {
                    budget: '25000',
                    timeline: '2 weeks',
                    store_locations: '3'
                },
                createdAt: '2025-06-20T11:45:00'
            }
        ];

        this.communications = {
            calls: [
                {
                    id: 1,
                    type: 'outbound',
                    clientId: 1,
                    clientName: 'Jean Dupont',
                    phone: '+33123456789',
                    userId: 2, // Sophie
                    userName: 'Sophie Martin',
                    date: '2025-06-24T10:30:00',
                    duration: 300, // secondes
                    status: 'completed',
                    notes: 'Suivi de commande, client satisfait. Intéressé par nouveaux produits.',
                    tags: ['Suivi', 'Satisfaction'],
                    nextAction: 'Envoyer catalogue nouveautés',
                    recording: null // URL vers enregistrement si disponible
                },
                {
                    id: 2,
                    type: 'inbound',
                    clientId: 2,
                    clientName: 'Marie Martin',
                    phone: '+33987654321',
                    userId: 3, // Marie support
                    userName: 'Marie Dubois',
                    date: '2025-06-23T16:15:00',
                    duration: 450,
                    status: 'completed',
                    notes: 'Question sur délai de livraison. Rassurée sur les délais.',
                    tags: ['Support', 'Livraison'],
                    nextAction: 'Suivi livraison',
                    recording: null
                }
            ],
            sms: [
                {
                    id: 1,
                    type: 'outbound',
                    clientId: 2,
                    clientName: 'Marie Martin',
                    phone: '+33987654321',
                    userId: 4, // Paul livraison
                    userName: 'Paul Durand',
                    content: 'Bonjour Marie, votre commande #MRB2025002 sera livrée demain entre 10h-12h. Merci de votre confiance! - Mireb Commercial',
                    date: '2025-06-24T09:15:00',
                    status: 'sent',
                    delivered: true,
                    read: true,
                    tags: ['Livraison', 'Notification']
                },
                {
                    id: 2,
                    type: 'outbound',
                    clientId: 1,
                    clientName: 'Jean Dupont',
                    phone: '+33123456789',
                    userId: 2,
                    userName: 'Sophie Martin',
                    content: '🎉 Nouvelles arrivées! Découvrez notre sélection high-tech avec -20% jusqu\'à dimanche. Code: TECH20. Voir: https://mireb.com/promo',
                    date: '2025-06-22T14:00:00',
                    status: 'sent',
                    delivered: true,
                    read: false,
                    tags: ['Promotion', 'Marketing']
                }
            ],
            whatsapp: [
                {
                    id: 1,
                    type: 'outbound',
                    clientId: 2,
                    clientName: 'Marie Martin',
                    phone: '+33987654321',
                    userId: 2,
                    userName: 'Sophie Martin',
                    content: 'Salut Marie! 👋 J\'espère que tu vas bien. Je voulais te montrer notre nouvelle collection qui pourrait t\'intéresser pour ton studio. Tu as 5 min pour un appel cette semaine?',
                    date: '2025-06-21T11:30:00',
                    status: 'sent',
                    delivered: true,
                    read: true,
                    replied: true,
                    tags: ['Vente', 'Personnel'],
                    mediaUrl: null // URL vers image/document envoyé
                },
                {
                    id: 2,
                    type: 'inbound',
                    clientId: 2,
                    clientName: 'Marie Martin',
                    phone: '+33987654321',
                    userId: 2,
                    userName: 'Sophie Martin',
                    content: 'Salut Sophie! Oui je suis très intéressée 😊 Je peux t\'appeler jeudi matin vers 10h?',
                    date: '2025-06-21T15:45:00',
                    status: 'received',
                    delivered: true,
                    read: true,
                    replied: false,
                    tags: ['Vente', 'Planification']
                }
            ]
        };

        this.integrations = {
            facebook: {
                isActive: false,
                accessToken: '',
                pageId: '',
                webhookUrl: '',
                leadForms: []
            },
            instagram: {
                isActive: false,
                accessToken: '',
                businessAccountId: '',
                webhookUrl: ''
            },
            whatsapp: {
                isActive: false,
                accessToken: '',
                phoneNumberId: '',
                businessAccountId: '',
                webhookUrl: ''
            },
            sms: {
                provider: 'twilio', // twilio, ovh, orange, etc.
                isActive: false,
                accountSid: '',
                authToken: '',
                phoneNumber: ''
            }
        };
    }

    /* ==================== GESTION DES CLIENTS ==================== */

    // Obtenir tous les clients avec filtres
    getAllClients(filters = {}) {
        let filteredClients = [...this.clients];

        if (filters.status) {
            filteredClients = filteredClients.filter(c => c.status === filters.status);
        }

        if (filters.segment) {
            filteredClients = filteredClients.filter(c => c.segment === filters.segment);
        }

        if (filters.city) {
            filteredClients = filteredClients.filter(c => 
                c.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.tags) {
            filteredClients = filteredClients.filter(c =>
                filters.tags.some(tag => c.tags.includes(tag))
            );
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filteredClients = filteredClients.filter(c =>
                c.firstname.toLowerCase().includes(search) ||
                c.lastname.toLowerCase().includes(search) ||
                c.email.toLowerCase().includes(search) ||
                c.phone.includes(search) ||
                (c.company && c.company.toLowerCase().includes(search))
            );
        }

        return filteredClients.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    }

    // Obtenir un client par ID
    getClientById(id) {
        return this.clients.find(c => c.id === parseInt(id));
    }

    // Ajouter un nouveau client
    addClient(clientData) {
        const newId = Math.max(...this.clients.map(c => c.id), 0) + 1;
        const newClient = {
            id: newId,
            ...clientData,
            orders: 0,
            totalValue: 0,
            averageOrderValue: 0,
            lastActivity: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            tags: clientData.tags || [],
            customFields: clientData.customFields || {},
            preferences: {
                contactMethod: 'email',
                language: 'fr',
                categories: [],
                ...clientData.preferences
            }
        };

        this.clients.push(newClient);
        this.saveToLocalStorage();

        return newClient;
    }

    // Mettre à jour un client
    updateClient(id, updateData) {
        const clientIndex = this.clients.findIndex(c => c.id === parseInt(id));
        if (clientIndex === -1) return null;

        this.clients[clientIndex] = { ...this.clients[clientIndex], ...updateData };
        this.clients[clientIndex].lastActivity = new Date().toISOString();
        
        this.saveToLocalStorage();
        return this.clients[clientIndex];
    }

    // Calculer le score client
    calculateClientScore(client) {
        let score = 0;
        
        // Valeur des commandes (40%)
        if (client.totalValue > 5000) score += 40;
        else if (client.totalValue > 2000) score += 30;
        else if (client.totalValue > 500) score += 20;
        else if (client.totalValue > 0) score += 10;

        // Fréquence des commandes (30%)
        if (client.orders > 20) score += 30;
        else if (client.orders > 10) score += 25;
        else if (client.orders > 5) score += 20;
        else if (client.orders > 0) score += 10;

        // Récence (20%)
        const daysSinceLastOrder = client.lastOrderDate ? 
            (new Date() - new Date(client.lastOrderDate)) / (1000 * 60 * 60 * 24) : 
            365;
        
        if (daysSinceLastOrder < 30) score += 20;
        else if (daysSinceLastOrder < 90) score += 15;
        else if (daysSinceLastOrder < 180) score += 10;
        else if (daysSinceLastOrder < 365) score += 5;

        // Engagement (10%)
        if (client.socialProfiles && Object.keys(client.socialProfiles).length > 0) score += 5;
        if (client.preferences.contactMethod !== 'none') score += 5;

        return Math.min(score, 100);
    }

    /* ==================== GESTION DES LEADS ==================== */

    // Obtenir tous les leads
    getAllLeads(filters = {}) {
        let filteredLeads = [...this.leads];

        if (filters.status) {
            filteredLeads = filteredLeads.filter(l => l.status === filters.status);
        }

        if (filters.source) {
            filteredLeads = filteredLeads.filter(l => l.source === filters.source);
        }

        if (filters.temperature) {
            filteredLeads = filteredLeads.filter(l => l.temperature === filters.temperature);
        }

        if (filters.assignedTo) {
            filteredLeads = filteredLeads.filter(l => l.assignedTo === parseInt(filters.assignedTo));
        }

        return filteredLeads.sort((a, b) => b.score - a.score);
    }

    // Importer des leads depuis Facebook
    async importFacebookLeads(formId) {
        if (!this.integrations.facebook.isActive) {
            throw new Error('Intégration Facebook non configurée');
        }

        // Simulation d'import Facebook Lead Ads
        const mockLeads = [
            {
                name: 'Sophie Laurent',
                email: 'sophie.laurent@email.com',
                phone: '+33555666777',
                company: 'Startup Innovation',
                source: 'Facebook',
                campaign: 'Été 2025 - Électronique',
                interest: 'Ordinateurs portables'
            }
        ];

        const importedLeads = mockLeads.map(leadData => this.addLead({
            ...leadData,
            status: 'new',
            temperature: 'warm',
            score: 60
        }));

        return importedLeads;
    }

    // Ajouter un nouveau lead
    addLead(leadData) {
        const newId = Math.max(...this.leads.map(l => l.id), 0) + 1;
        const newLead = {
            id: newId,
            ...leadData,
            status: leadData.status || 'new',
            score: leadData.score || this.calculateLeadScore(leadData),
            temperature: leadData.temperature || this.determineLeadTemperature(leadData),
            assignedTo: leadData.assignedTo || null,
            lastContact: null,
            tags: leadData.tags || [],
            customFields: leadData.customFields || {},
            createdAt: new Date().toISOString()
        };

        this.leads.push(newLead);
        this.saveToLocalStorage();

        return newLead;
    }

    // Calculer le score d'un lead
    calculateLeadScore(lead) {
        let score = 0;

        // Source (25%)
        const sourceScores = {
            'Website': 20,
            'Facebook': 18,
            'Instagram': 16,
            'Google': 22,
            'Referral': 25,
            'Email': 15
        };
        score += sourceScores[lead.source] || 10;

        // Budget (30%)
        const budget = parseInt(lead.customFields?.budget) || 0;
        if (budget > 50000) score += 30;
        else if (budget > 20000) score += 25;
        else if (budget > 10000) score += 20;
        else if (budget > 5000) score += 15;
        else if (budget > 1000) score += 10;

        // Urgence (20%)
        const timeline = lead.customFields?.timeline || '';
        if (timeline.includes('immediate') || timeline.includes('urgent')) score += 20;
        else if (timeline.includes('week')) score += 18;
        else if (timeline.includes('month')) score += 15;
        else if (timeline.includes('quarter')) score += 10;

        // Décideur (15%)
        if (lead.customFields?.decision_maker === 'yes') score += 15;

        // Données complètes (10%)
        if (lead.email) score += 3;
        if (lead.phone) score += 3;
        if (lead.company) score += 4;

        return Math.min(score, 100);
    }

    // Déterminer la température d'un lead
    determineLeadTemperature(lead) {
        const score = lead.score || this.calculateLeadScore(lead);
        
        if (score >= 80) return 'hot';
        else if (score >= 60) return 'warm';
        else return 'cold';
    }

    // Convertir un lead en client
    convertLeadToClient(leadId) {
        const lead = this.leads.find(l => l.id === parseInt(leadId));
        if (!lead) return null;

        const clientData = {
            firstname: lead.name.split(' ')[0],
            lastname: lead.name.split(' ').slice(1).join(' '),
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            status: 'active',
            segment: lead.temperature === 'hot' ? 'premium' : 'standard',
            acquisitionChannel: lead.source,
            notes: `Converti depuis lead - ${lead.notes || ''}`,
            tags: [...(lead.tags || []), 'Converted Lead'],
            customFields: lead.customFields || {}
        };

        const newClient = this.addClient(clientData);
        
        // Marquer le lead comme converti
        lead.status = 'converted';
        lead.convertedAt = new Date().toISOString();
        lead.convertedToClientId = newClient.id;

        this.saveToLocalStorage();
        return newClient;
    }

    /* ==================== COMMUNICATIONS ==================== */

    // Lancer un appel local
    async makeLocalCall(clientId, notes = '') {
        const client = this.getClientById(clientId);
        if (!client) {
            throw new Error('Client non trouvé');
        }

        // Vérifier si l'utilisateur a les permissions
        if (!window.userManager?.hasPermission('customers') && !window.userManager?.hasPermission('all')) {
            throw new Error('Permission insuffisante');
        }

        const callData = {
            id: this.generateId('call'),
            type: 'outbound',
            clientId: client.id,
            clientName: `${client.firstname} ${client.lastname}`,
            phone: client.phone,
            userId: window.userManager?.getCurrentUser()?.id || 1,
            userName: window.userManager?.getCurrentUser()?.firstName || 'Admin',
            date: new Date().toISOString(),
            duration: 0,
            status: 'initiated',
            notes: notes,
            tags: ['Outbound'],
            nextAction: '',
            recording: null
        };

        this.communications.calls.push(callData);
        this.saveToLocalStorage();

        // Simulation de l'appel local (remplacer par vraie intégration)
        console.log(`📞 Appel initié vers ${client.phone} (${client.firstname} ${client.lastname})`);
        
        // Ici, vous pourriez intégrer:
        // - Web RTC pour appels navigateur
        // - API Twilio Voice
        // - Intégration avec softphone local
        // - Protocol tel: pour applications natives
        
        // Ouvrir l'application téléphone du système
        try {
            window.open(`tel:${client.phone}`, '_self');
        } catch (error) {
            console.log('Ouverture manuelle de l\'application téléphone nécessaire');
        }

        return callData;
    }

    // Finaliser un appel
    finalizeCall(callId, duration, notes, nextAction = '') {
        const call = this.communications.calls.find(c => c.id === callId);
        if (!call) return null;

        call.duration = parseInt(duration);
        call.status = 'completed';
        call.notes = notes;
        call.nextAction = nextAction;

        // Mettre à jour l'activité du client
        const client = this.getClientById(call.clientId);
        if (client) {
            client.lastActivity = new Date().toISOString();
        }

        this.saveToLocalStorage();
        return call;
    }

    // Envoyer un SMS
    async sendSMS(clientId, message, tags = []) {
        const client = this.getClientById(clientId);
        if (!client) {
            throw new Error('Client non trouvé');
        }

        if (!this.integrations.sms.isActive) {
            throw new Error('Intégration SMS non configurée');
        }

        const smsData = {
            id: this.generateId('sms'),
            type: 'outbound',
            clientId: client.id,
            clientName: `${client.firstname} ${client.lastname}`,
            phone: client.phone,
            userId: window.userManager?.getCurrentUser()?.id || 1,
            userName: window.userManager?.getCurrentUser()?.firstName || 'Admin',
            content: message,
            date: new Date().toISOString(),
            status: 'sending',
            delivered: false,
            read: false,
            tags: tags
        };

        this.communications.sms.push(smsData);

        // Simulation d'envoi SMS (remplacer par vraie API)
        console.log(`📱 SMS envoyé à ${client.phone}:`, message);
        
        // Ici, intégrer une vraie API SMS (Twilio, OVH, Orange, etc.)
        try {
            // const result = await this.sendSMSViaProvider(client.phone, message);
            
            // Simulation de succès
            setTimeout(() => {
                smsData.status = 'sent';
                smsData.delivered = true;
                this.saveToLocalStorage();
            }, 1000);
            
        } catch (error) {
            smsData.status = 'failed';
            console.error('Erreur envoi SMS:', error);
        }

        this.saveToLocalStorage();
        return smsData;
    }

    // Envoyer un message WhatsApp
    async sendWhatsApp(clientId, message, tags = [], mediaUrl = null) {
        const client = this.getClientById(clientId);
        if (!client) {
            throw new Error('Client non trouvé');
        }

        if (!this.integrations.whatsapp.isActive) {
            throw new Error('Intégration WhatsApp non configurée');
        }

        const whatsappData = {
            id: this.generateId('whatsapp'),
            type: 'outbound',
            clientId: client.id,
            clientName: `${client.firstname} ${client.lastname}`,
            phone: client.whatsapp || client.phone,
            userId: window.userManager?.getCurrentUser()?.id || 1,
            userName: window.userManager?.getCurrentUser()?.firstName || 'Admin',
            content: message,
            date: new Date().toISOString(),
            status: 'sending',
            delivered: false,
            read: false,
            replied: false,
            tags: tags,
            mediaUrl: mediaUrl
        };

        this.communications.whatsapp.push(whatsappData);

        // Simulation d'envoi WhatsApp (remplacer par vraie API)
        console.log(`📱 WhatsApp envoyé à ${client.whatsapp || client.phone}:`, message);
        
        // Ici, intégrer WhatsApp Business API
        try {
            // const result = await this.sendWhatsAppViaAPI(client.phone, message, mediaUrl);
            
            // Simulation de succès
            setTimeout(() => {
                whatsappData.status = 'sent';
                whatsappData.delivered = true;
                this.saveToLocalStorage();
            }, 1500);
            
        } catch (error) {
            whatsappData.status = 'failed';
            console.error('Erreur envoi WhatsApp:', error);
        }

        this.saveToLocalStorage();
        return whatsappData;
    }

    // Ouvrir WhatsApp Web
    openWhatsAppWeb(clientId) {
        const client = this.getClientById(clientId);
        if (!client) return;

        const phone = (client.whatsapp || client.phone).replace(/[^0-9]/g, '');
        const message = encodeURIComponent(`Bonjour ${client.firstname}, `);
        const url = `https://wa.me/${phone}?text=${message}`;
        
        window.open(url, '_blank');
        
        // Enregistrer l'interaction
        this.recordInteraction(clientId, 'whatsapp_web_opened', 'WhatsApp Web ouvert');
    }

    /* ==================== ANALYTICS ET STATISTIQUES ==================== */

    // Obtenir les statistiques CRM
    getCRMStats(period = 'month') {
        const clients = this.clients;
        const leads = this.leads;
        const calls = this.communications.calls;
        const sms = this.communications.sms;
        const whatsapp = this.communications.whatsapp;

        // Filtrer par période
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const periodClients = clients.filter(c => new Date(c.createdAt) >= startDate);
        const periodLeads = leads.filter(l => new Date(l.createdAt) >= startDate);
        const periodCalls = calls.filter(c => new Date(c.date) >= startDate);

        return {
            clients: {
                total: clients.length,
                new: periodClients.length,
                active: clients.filter(c => c.status === 'active').length,
                vip: clients.filter(c => c.segment === 'vip').length,
                totalValue: clients.reduce((sum, c) => sum + c.totalValue, 0),
                averageValue: clients.length > 0 ? clients.reduce((sum, c) => sum + c.totalValue, 0) / clients.length : 0
            },
            leads: {
                total: leads.length,
                new: periodLeads.length,
                hot: leads.filter(l => l.temperature === 'hot').length,
                converted: leads.filter(l => l.status === 'converted').length,
                conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'converted').length / leads.length) * 100 : 0
            },
            communications: {
                calls: periodCalls.length,
                sms: sms.filter(s => new Date(s.date) >= startDate).length,
                whatsapp: whatsapp.filter(w => new Date(w.date) >= startDate).length,
                totalDuration: periodCalls.reduce((sum, c) => sum + (c.duration || 0), 0)
            }
        };
    }

    // Enregistrer une interaction
    recordInteraction(clientId, type, notes) {
        const client = this.getClientById(clientId);
        if (!client) return;

        client.lastActivity = new Date().toISOString();
        
        // Ajouter à l'historique si il existe
        if (!client.interactions) {
            client.interactions = [];
        }
        
        client.interactions.push({
            type: type,
            date: new Date().toISOString(),
            userId: window.userManager?.getCurrentUser()?.id || 1,
            notes: notes
        });

        this.saveToLocalStorage();
    }

    // Générer un ID unique
    generateId(prefix = 'item') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /* ==================== PERSISTENCE ==================== */

    // Sauvegarder dans le localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('mireb_crm_clients', JSON.stringify(this.clients));
            localStorage.setItem('mireb_crm_leads', JSON.stringify(this.leads));
            localStorage.setItem('mireb_crm_communications', JSON.stringify(this.communications));
            localStorage.setItem('mireb_crm_integrations', JSON.stringify(this.integrations));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde CRM:', error);
        }
    }

    // Charger depuis le localStorage
    loadFromLocalStorage() {
        try {
            const savedClients = localStorage.getItem('mireb_crm_clients');
            const savedLeads = localStorage.getItem('mireb_crm_leads');
            const savedCommunications = localStorage.getItem('mireb_crm_communications');
            const savedIntegrations = localStorage.getItem('mireb_crm_integrations');
            
            if (savedClients) {
                this.clients = JSON.parse(savedClients);
            }
            
            if (savedLeads) {
                this.leads = JSON.parse(savedLeads);
            }
            
            if (savedCommunications) {
                this.communications = JSON.parse(savedCommunications);
            }
            
            if (savedIntegrations) {
                this.integrations = JSON.parse(savedIntegrations);
            }
        } catch (error) {
            console.error('Erreur lors du chargement CRM:', error);
        }
    }

    // Exporter les données
    exportData() {
        return {
            clients: this.clients,
            leads: this.leads,
            communications: this.communications,
            integrations: this.integrations,
            exportDate: new Date().toISOString()
        };
    }
}

// Initialiser le CRM
window.crmManager = new CRMManager();
window.crmManager.loadFromLocalStorage();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CRMManager;
}
