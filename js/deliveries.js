// Gestion avancée des livraisons pour Mireb Commercial
// Système complet de suivi et optimisation des livraisons

class DeliveriesManager {
    constructor() {
        this.deliveries = [
            {
                id: 1,
                trackingNumber: 'MRB2025001',
                orderId: 1,
                clientId: 1,
                clientName: 'Jean Dupont',
                clientPhone: '+33123456789',
                clientEmail: 'jean.dupont@email.com',
                address: {
                    street: '123 Rue de la République',
                    city: 'Paris',
                    postal: '75001',
                    country: 'France',
                    coordinates: { lat: 48.8566, lng: 2.3522 }
                },
                products: [
                    { name: 'Ordinateur portable', quantity: 1, weight: 2.5 },
                    { name: 'Souris sans fil', quantity: 1, weight: 0.1 }
                ],
                totalWeight: 2.6,
                dimensions: '35x25x5 cm',
                driver: {
                    id: 1,
                    name: 'Jean Martin',
                    phone: '+33666777888',
                    vehicle: 'Renault Kangoo - AB-123-CD'
                },
                status: 'shipped', // pending, confirmed, shipped, in_transit, delivered, failed
                priority: 'normal', // low, normal, high, urgent
                scheduledDate: '2025-06-25T14:00:00',
                estimatedDelivery: '2025-06-25T16:00:00',
                actualDeliveryDate: null,
                notes: 'Livraison au 2ème étage, code 1234',
                specialInstructions: 'Appeler avant livraison',
                cost: 15.50,
                distance: 12.5, // km
                route: [],
                history: [
                    { status: 'pending', date: '2025-06-24T10:00:00', note: 'Commande reçue' },
                    { status: 'confirmed', date: '2025-06-24T14:00:00', note: 'Livraison confirmée' },
                    { status: 'shipped', date: '2025-06-25T09:00:00', note: 'Expédiée par Jean Martin' }
                ],
                rating: null,
                feedback: null
            },
            {
                id: 2,
                trackingNumber: 'MRB2025002',
                orderId: 2,
                clientId: 2,
                clientName: 'Marie Martin',
                clientPhone: '+33987654321',
                clientEmail: 'marie.martin@email.com',
                address: {
                    street: '456 Avenue des Arts',
                    city: 'Lyon',
                    postal: '69000',
                    country: 'France',
                    coordinates: { lat: 45.7640, lng: 4.8357 }
                },
                products: [
                    { name: 'Veste designer', quantity: 2, weight: 1.2 }
                ],
                totalWeight: 1.2,
                dimensions: '30x20x8 cm',
                driver: {
                    id: 2,
                    name: 'Paul Durand',
                    phone: '+33777888999',
                    vehicle: 'Peugeot Partner - CD-456-EF'
                },
                status: 'delivered',
                priority: 'high',
                scheduledDate: '2025-06-24T10:00:00',
                estimatedDelivery: '2025-06-24T12:00:00',
                actualDeliveryDate: '2025-06-24T11:30:00',
                notes: 'Livraison express demandée',
                specialInstructions: 'Remise en main propre uniquement',
                cost: 25.00,
                distance: 8.3,
                route: [],
                history: [
                    { status: 'pending', date: '2025-06-23T15:00:00', note: 'Commande reçue' },
                    { status: 'confirmed', date: '2025-06-23T16:00:00', note: 'Livraison express confirmée' },
                    { status: 'shipped', date: '2025-06-24T08:00:00', note: 'Expédiée par Paul Durand' },
                    { status: 'delivered', date: '2025-06-24T11:30:00', note: 'Livrée avec succès' }
                ],
                rating: 5,
                feedback: 'Livraison parfaite et rapide!'
            }
        ];

        this.drivers = [
            {
                id: 1,
                name: 'Jean Martin',
                phone: '+33666777888',
                email: 'jean.martin@mireb.com',
                vehicle: 'Renault Kangoo - AB-123-CD',
                isActive: true,
                currentLocation: { lat: 48.8566, lng: 2.3522 },
                maxCapacity: 500, // kg
                zones: ['Paris', 'Banlieue Paris'],
                rating: 4.8,
                totalDeliveries: 156,
                onTimePercentage: 94
            },
            {
                id: 2,
                name: 'Paul Durand',
                phone: '+33777888999',
                email: 'paul.durand@mireb.com',
                vehicle: 'Peugeot Partner - CD-456-EF',
                isActive: true,
                currentLocation: { lat: 45.7640, lng: 4.8357 },
                maxCapacity: 300,
                zones: ['Lyon', 'Villeurbanne', 'Bron'],
                rating: 4.9,
                totalDeliveries: 203,
                onTimePercentage: 97
            }
        ];

        this.zones = [
            { id: 1, name: 'Paris Centre', cost: 10, maxDistance: 5, driver: 1 },
            { id: 2, name: 'Paris Banlieue', cost: 15, maxDistance: 20, driver: 1 },
            { id: 3, name: 'Lyon Centre', cost: 12, maxDistance: 8, driver: 2 },
            { id: 4, name: 'Lyon Périphérie', cost: 18, maxDistance: 25, driver: 2 }
        ];
    }

    // Obtenir toutes les livraisons
    getAllDeliveries(filters = {}) {
        let filteredDeliveries = [...this.deliveries];

        if (filters.status) {
            filteredDeliveries = filteredDeliveries.filter(d => d.status === filters.status);
        }

        if (filters.driver) {
            filteredDeliveries = filteredDeliveries.filter(d => d.driver.id === parseInt(filters.driver));
        }

        if (filters.priority) {
            filteredDeliveries = filteredDeliveries.filter(d => d.priority === filters.priority);
        }

        if (filters.dateFrom) {
            filteredDeliveries = filteredDeliveries.filter(d => 
                new Date(d.scheduledDate) >= new Date(filters.dateFrom)
            );
        }

        if (filters.dateTo) {
            filteredDeliveries = filteredDeliveries.filter(d => 
                new Date(d.scheduledDate) <= new Date(filters.dateTo)
            );
        }

        return filteredDeliveries.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
    }

    // Obtenir une livraison par ID
    getDeliveryById(id) {
        return this.deliveries.find(d => d.id === parseInt(id));
    }

    // Obtenir une livraison par numéro de suivi
    getDeliveryByTracking(trackingNumber) {
        return this.deliveries.find(d => d.trackingNumber === trackingNumber);
    }

    // Créer une nouvelle livraison
    createDelivery(deliveryData) {
        const newId = Math.max(...this.deliveries.map(d => d.id), 0) + 1;
        const trackingNumber = this.generateTrackingNumber();
        
        const newDelivery = {
            id: newId,
            trackingNumber,
            ...deliveryData,
            status: 'pending',
            history: [{
                status: 'pending',
                date: new Date().toISOString(),
                note: 'Livraison créée'
            }],
            cost: this.calculateDeliveryCost(deliveryData),
            distance: this.calculateDistance(deliveryData.address)
        };

        this.deliveries.push(newDelivery);
        this.saveToLocalStorage();
        
        // Notification automatique au client
        this.sendDeliveryNotification(newDelivery, 'created');
        
        return newDelivery;
    }

    // Mettre à jour le statut d'une livraison
    updateDeliveryStatus(id, newStatus, note = '') {
        const delivery = this.getDeliveryById(id);
        if (!delivery) return false;

        const oldStatus = delivery.status;
        delivery.status = newStatus;
        
        // Ajouter à l'historique
        delivery.history.push({
            status: newStatus,
            date: new Date().toISOString(),
            note: note || `Statut changé de ${oldStatus} à ${newStatus}`
        });

        // Date de livraison effective si livrée
        if (newStatus === 'delivered') {
            delivery.actualDeliveryDate = new Date().toISOString();
        }

        this.saveToLocalStorage();
        
        // Notification automatique
        this.sendDeliveryNotification(delivery, 'status_updated');
        
        return true;
    }

    // Assigner un livreur
    assignDriver(deliveryId, driverId) {
        const delivery = this.getDeliveryById(deliveryId);
        const driver = this.drivers.find(d => d.id === parseInt(driverId));
        
        if (!delivery || !driver) return false;

        delivery.driver = {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            vehicle: driver.vehicle
        };

        delivery.history.push({
            status: delivery.status,
            date: new Date().toISOString(),
            note: `Livreur assigné: ${driver.name}`
        });

        this.saveToLocalStorage();
        return true;
    }

    // Optimiser les tournées
    optimizeRoutes(date = new Date()) {
        const dailyDeliveries = this.deliveries.filter(d => {
            const deliveryDate = new Date(d.scheduledDate);
            return deliveryDate.toDateString() === date.toDateString() && 
                   ['pending', 'confirmed'].includes(d.status);
        });

        const routes = {};
        
        // Grouper par livreur
        dailyDeliveries.forEach(delivery => {
            const driverId = delivery.driver?.id || 'unassigned';
            if (!routes[driverId]) {
                routes[driverId] = [];
            }
            routes[driverId].push(delivery);
        });

        // Optimiser chaque tournée
        Object.keys(routes).forEach(driverId => {
            if (driverId !== 'unassigned') {
                routes[driverId] = this.optimizeSingleRoute(routes[driverId]);
            }
        });

        return routes;
    }

    // Optimiser une tournée individuelle
    optimizeSingleRoute(deliveries) {
        // Algorithme simple de tri par proximité géographique
        const sorted = [...deliveries];
        const result = [];
        let current = { coordinates: { lat: 48.8566, lng: 2.3522 } }; // Point de départ

        while (sorted.length > 0) {
            let nearest = 0;
            let minDistance = Infinity;

            sorted.forEach((delivery, index) => {
                const distance = this.calculateDistanceBetweenPoints(
                    current.address?.coordinates || current.coordinates,
                    delivery.address.coordinates
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = index;
                }
            });

            current = sorted[nearest];
            result.push(sorted.splice(nearest, 1)[0]);
        }

        return result;
    }

    // Calculer la distance entre deux points
    calculateDistanceBetweenPoints(point1, point2) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLon = (point2.lng - point1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Générer un numéro de suivi
    generateTrackingNumber() {
        const year = new Date().getFullYear();
        const number = (this.deliveries.length + 1).toString().padStart(3, '0');
        return `MRB${year}${number}`;
    }

    // Calculer le coût de livraison
    calculateDeliveryCost(deliveryData) {
        const baseRate = 10; // Tarif de base
        const weightRate = 2; // Par kg
        const distanceRate = 1.5; // Par km
        const priorityMultiplier = deliveryData.priority === 'urgent' ? 2 : 
                                 deliveryData.priority === 'high' ? 1.5 : 1;

        const weightCost = (deliveryData.totalWeight || 0) * weightRate;
        const distanceCost = (deliveryData.distance || 0) * distanceRate;
        
        return Math.round((baseRate + weightCost + distanceCost) * priorityMultiplier * 100) / 100;
    }

    // Calculer la distance (simulation)
    calculateDistance(address) {
        // Simulation - remplacer par vraie API de géocodage
        return Math.random() * 20 + 5; // Entre 5 et 25 km
    }

    // Envoyer une notification de livraison
    async sendDeliveryNotification(delivery, type) {
        const notifications = {
            created: {
                title: 'Livraison programmée',
                message: `Votre commande ${delivery.trackingNumber} est programmée pour le ${new Date(delivery.scheduledDate).toLocaleDateString()}`
            },
            status_updated: {
                title: 'Statut de livraison mis à jour',
                message: `Votre commande ${delivery.trackingNumber} est maintenant: ${this.getStatusLabel(delivery.status)}`
            },
            delivered: {
                title: 'Livraison effectuée',
                message: `Votre commande ${delivery.trackingNumber} a été livrée avec succès!`
            }
        };

        const notification = notifications[type];
        if (!notification) return;

        // Simulation d'envoi de notification
        console.log(`📱 Notification envoyée à ${delivery.clientName}:`, notification);
        
        // Ici, vous pourriez intégrer:
        // - SMS via Twilio
        // - Email via SendGrid
        // - WhatsApp Business API
        // - Push notifications
        
        return true;
    }

    // Obtenir le libellé du statut
    getStatusLabel(status) {
        const labels = {
            pending: 'En attente',
            confirmed: 'Confirmée',
            shipped: 'Expédiée',
            in_transit: 'En transit',
            delivered: 'Livrée',
            failed: 'Échec de livraison'
        };
        return labels[status] || status;
    }

    // Obtenir les statistiques de livraison
    getDeliveryStats(period = 'month') {
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

        const periodDeliveries = this.deliveries.filter(d => 
            new Date(d.scheduledDate) >= startDate
        );

        return {
            total: periodDeliveries.length,
            delivered: periodDeliveries.filter(d => d.status === 'delivered').length,
            pending: periodDeliveries.filter(d => ['pending', 'confirmed'].includes(d.status)).length,
            failed: periodDeliveries.filter(d => d.status === 'failed').length,
            totalRevenue: periodDeliveries.reduce((sum, d) => sum + (d.cost || 0), 0),
            averageRating: this.calculateAverageRating(periodDeliveries),
            onTimeDeliveries: periodDeliveries.filter(d => 
                d.status === 'delivered' && d.actualDeliveryDate && 
                new Date(d.actualDeliveryDate) <= new Date(d.estimatedDelivery)
            ).length
        };
    }

    // Calculer la note moyenne
    calculateAverageRating(deliveries) {
        const ratedDeliveries = deliveries.filter(d => d.rating);
        if (ratedDeliveries.length === 0) return 0;
        
        const totalRating = ratedDeliveries.reduce((sum, d) => sum + d.rating, 0);
        return Math.round((totalRating / ratedDeliveries.length) * 10) / 10;
    }

    // Obtenir les livraisons du jour
    getTodayDeliveries() {
        const today = new Date();
        return this.deliveries.filter(d => {
            const deliveryDate = new Date(d.scheduledDate);
            return deliveryDate.toDateString() === today.toDateString();
        });
    }

    // Obtenir les livraisons par livreur
    getDeliveriesByDriver(driverId) {
        return this.deliveries.filter(d => d.driver?.id === parseInt(driverId));
    }

    // Ajouter un commentaire à une livraison
    addDeliveryNote(deliveryId, note) {
        const delivery = this.getDeliveryById(deliveryId);
        if (!delivery) return false;

        delivery.history.push({
            status: delivery.status,
            date: new Date().toISOString(),
            note: note
        });

        this.saveToLocalStorage();
        return true;
    }

    // Sauvegarder dans le localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('mireb_deliveries', JSON.stringify(this.deliveries));
            localStorage.setItem('mireb_drivers', JSON.stringify(this.drivers));
            localStorage.setItem('mireb_delivery_zones', JSON.stringify(this.zones));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des livraisons:', error);
        }
    }

    // Charger depuis le localStorage
    loadFromLocalStorage() {
        try {
            const savedDeliveries = localStorage.getItem('mireb_deliveries');
            const savedDrivers = localStorage.getItem('mireb_drivers');
            const savedZones = localStorage.getItem('mireb_delivery_zones');
            
            if (savedDeliveries) {
                this.deliveries = JSON.parse(savedDeliveries);
            }
            
            if (savedDrivers) {
                this.drivers = JSON.parse(savedDrivers);
            }
            
            if (savedZones) {
                this.zones = JSON.parse(savedZones);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des livraisons:', error);
        }
    }

    // Exporter les données
    exportData() {
        return {
            deliveries: this.deliveries,
            drivers: this.drivers,
            zones: this.zones,
            exportDate: new Date().toISOString()
        };
    }
}

// Initialiser le gestionnaire de livraisons
window.deliveriesManager = new DeliveriesManager();
window.deliveriesManager.loadFromLocalStorage();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeliveriesManager;
}
