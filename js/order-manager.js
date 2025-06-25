// Gestionnaire de commandes intégré à l'interface Shopify
// Synchronisation complète avec les commandes de la page d'accueil

class OrderManager {
    constructor() {
        this.orders = [];
        this.customers = [];
        this.orderStatuses = [
            { value: 'pending', label: 'En attente', color: '#f59e0b', icon: 'fas fa-clock' },
            { value: 'confirmed', label: 'Confirmée', color: '#3b82f6', icon: 'fas fa-check-circle' },
            { value: 'processing', label: 'En préparation', color: '#8b5cf6', icon: 'fas fa-cog' },
            { value: 'shipped', label: 'Expédiée', color: '#06b6d4', icon: 'fas fa-truck' },
            { value: 'delivered', label: 'Livrée', color: '#10b981', icon: 'fas fa-box-open' },
            { value: 'cancelled', label: 'Annulée', color: '#ef4444', icon: 'fas fa-times-circle' }
        ];
        
        this.init();
    }

    init() {
        this.loadOrders();
        this.loadCustomers();
        this.setupEventListeners();
        console.log('📦 Gestionnaire de commandes initialisé');
    }

    // Charger les commandes depuis localStorage
    loadOrders() {
        try {
            const savedOrders = localStorage.getItem('commandes');
            this.orders = savedOrders ? JSON.parse(savedOrders) : [];
            
            // Convertir l'ancien format vers le nouveau si nécessaire
            this.orders = this.orders.map(order => ({
                id: order.id || 'CMD' + Date.now(),
                customerName: order.nom || order.customerName || '',
                customerPhone: order.tel || order.customerPhone || '',
                customerAddress: order.adresse || order.customerAddress || '',
                product: order.produit || order.product || '',
                price: parseFloat(order.prix || order.price || 0),
                date: order.date || new Date().toLocaleString(),
                status: order.status || 'pending',
                paymentMethod: order.paymentMethod || 'cash_on_delivery',
                notes: order.notes || '',
                trackingNumber: order.trackingNumber || ''
            }));

            console.log('📋 Commandes chargées:', this.orders.length);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des commandes:', error);
            this.orders = [];
        }
    }

    // Charger les clients depuis localStorage
    loadCustomers() {
        try {
            const savedCustomers = localStorage.getItem('clients');
            this.customers = savedCustomers ? JSON.parse(savedCustomers) : [];
            console.log('👥 Clients chargés:', this.customers.length);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des clients:', error);
            this.customers = [];
        }
    }

    // Sauvegarder les commandes
    saveOrders() {
        try {
            localStorage.setItem('commandes', JSON.stringify(this.orders));
            
            // Déclencher un événement pour notifier les autres composants
            window.dispatchEvent(new CustomEvent('ordersUpdated', {
                detail: {
                    orders: this.orders,
                    timestamp: Date.now()
                }
            }));
            
            console.log('💾 Commandes sauvegardées');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des commandes:', error);
        }
    }

    // Sauvegarder les clients
    saveCustomers() {
        try {
            localStorage.setItem('clients', JSON.stringify(this.customers));
            console.log('💾 Clients sauvegardés');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des clients:', error);
        }
    }

    // Ajouter une nouvelle commande
    addOrder(orderData) {
        try {
            const newOrder = {
                id: orderData.id || 'CMD' + Date.now(),
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                customerAddress: orderData.customerAddress,
                product: orderData.product,
                price: parseFloat(orderData.price),
                date: orderData.date || new Date().toLocaleString(),
                status: orderData.status || 'pending',
                paymentMethod: orderData.paymentMethod || 'cash_on_delivery',
                notes: orderData.notes || '',
                trackingNumber: orderData.trackingNumber || ''
            };

            this.orders.unshift(newOrder); // Ajouter au début
            this.updateCustomer(newOrder);
            this.saveOrders();
            this.saveCustomers();

            return newOrder;
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de la commande:', error);
            throw error;
        }
    }

    // Mettre à jour une commande
    updateOrder(orderId, orderData) {
        try {
            const index = this.orders.findIndex(order => order.id === orderId);
            if (index !== -1) {
                this.orders[index] = { ...this.orders[index], ...orderData };
                this.saveOrders();
                return this.orders[index];
            }
            throw new Error('Commande non trouvée');
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour de la commande:', error);
            throw error;
        }
    }

    // Supprimer une commande
    deleteOrder(orderId) {
        try {
            this.orders = this.orders.filter(order => order.id !== orderId);
            this.saveOrders();
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la suppression de la commande:', error);
            throw error;
        }
    }

    // Mettre à jour le statut d'une commande
    updateOrderStatus(orderId, status) {
        try {
            const order = this.orders.find(order => order.id === orderId);
            if (order) {
                order.status = status;
                
                // Générer un numéro de suivi si la commande est expédiée
                if (status === 'shipped' && !order.trackingNumber) {
                    order.trackingNumber = 'TRK' + Date.now();
                }
                
                this.saveOrders();
                return order;
            }
            throw new Error('Commande non trouvée');
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour du statut:', error);
            throw error;
        }
    }

    // Mettre à jour ou créer un client
    updateCustomer(order) {
        try {
            const existingCustomerIndex = this.customers.findIndex(
                customer => customer.tel === order.customerPhone
            );

            if (existingCustomerIndex !== -1) {
                // Client existant
                const customer = this.customers[existingCustomerIndex];
                customer.commandes = customer.commandes || [];
                customer.commandes.push(order.id);
                customer.valeurTotale = (customer.valeurTotale || 0) + order.price;
                customer.lastOrderDate = order.date;
            } else {
                // Nouveau client
                this.customers.push({
                    id: 'CLT' + Date.now(),
                    nom: order.customerName,
                    tel: order.customerPhone,
                    adresse: order.customerAddress,
                    commandes: [order.id],
                    valeurTotale: order.price,
                    dateCreation: order.date,
                    lastOrderDate: order.date
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour du client:', error);
        }
    }

    // Obtenir les statistiques des commandes
    getOrderStats() {
        const stats = {
            total: this.orders.length,
            pending: this.orders.filter(o => o.status === 'pending').length,
            confirmed: this.orders.filter(o => o.status === 'confirmed').length,
            processing: this.orders.filter(o => o.status === 'processing').length,
            shipped: this.orders.filter(o => o.status === 'shipped').length,
            delivered: this.orders.filter(o => o.status === 'delivered').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length,
            totalRevenue: this.orders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.price, 0),
            avgOrderValue: 0
        };

        if (stats.total > 0) {
            stats.avgOrderValue = stats.totalRevenue / stats.total;
        }

        return stats;
    }

    // Rechercher des commandes
    searchOrders(query) {
        const searchTerm = query.toLowerCase();
        return this.orders.filter(order =>
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerPhone.includes(searchTerm) ||
            order.product.toLowerCase().includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm)
        );
    }

    // Filtrer les commandes par statut
    filterOrdersByStatus(status) {
        if (status === 'all') return this.orders;
        return this.orders.filter(order => order.status === status);
    }

    // Obtenir les commandes récentes (dernières 24h)
    getRecentOrders() {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        return this.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate > oneDayAgo;
        });
    }

    // Exporter les commandes vers CSV
    exportToCSV() {
        try {
            const headers = [
                'ID', 'Client', 'Téléphone', 'Adresse', 'Produit', 
                'Prix', 'Date', 'Statut', 'Paiement', 'Suivi'
            ];
            
            const csvContent = [
                headers.join(','),
                ...this.orders.map(order => [
                    order.id,
                    `"${order.customerName}"`,
                    order.customerPhone,
                    `"${order.customerAddress}"`,
                    `"${order.product}"`,
                    order.price,
                    `"${order.date}"`,
                    order.status,
                    order.paymentMethod,
                    order.trackingNumber || ''
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `commandes-mireb-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'export CSV:', error);
            return false;
        }
    }

    // Configurer les écouteurs d'événements
    setupEventListeners() {
        // Écouter les nouvelles commandes depuis la page d'accueil
        window.addEventListener('storage', (e) => {
            if (e.key === 'commandes') {
                this.loadOrders();
                // Déclencher une mise à jour de l'interface si elle existe
                if (typeof window.updateOrdersDisplay === 'function') {
                    window.updateOrdersDisplay();
                }
            }
        });

        // Écouter les événements personnalisés
        window.addEventListener('newOrderReceived', (e) => {
            console.log('📥 Nouvelle commande reçue:', e.detail);
            this.loadOrders();
        });
    }

    // Obtenir le statut par sa valeur
    getStatusInfo(statusValue) {
        return this.orderStatuses.find(status => status.value === statusValue) || 
               { value: statusValue, label: statusValue, color: '#6b7280', icon: 'fas fa-question' };
    }
}

// Initialiser le gestionnaire de commandes
window.orderManager = new OrderManager();

// ============================================
// FONCTION GLOBALE DE NOTIFICATION
// ============================================

// Fonction globale pour afficher les notifications
function showNotification(message, type = 'info') {
    if (window.shopifyAdmin && typeof window.shopifyAdmin.showNotification === 'function') {
        window.shopifyAdmin.showNotification(message, type);
    } else {
        // Fallback si shopifyAdmin n'est pas disponible
        const notification = document.createElement('div');
        notification.className = 'sync-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: ${type === 'success' ? '#008060' : type === 'error' ? '#d72c0d' : type === 'warning' ? '#f59e0b' : '#202223'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, sans-serif;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span style="margin-left: 8px;">${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
}

// ============================================
// FONCTIONS SPÉCIFIQUES INTERFACE ADMIN SHOPIFY
// ============================================

// Fonction pour afficher les commandes dans l'interface admin
function displayOrdersInAdmin() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    const orders = window.orderManager.orders;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Aucune commande</h3>
                <p>Les commandes passées sur votre site apparaîtront ici.</p>
            </div>
        `;
        updateOrdersStats([]);
        return;
    }

    // Appliquer les filtres actifs
    const filteredOrders = applyCurrentFilters(orders);
    
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-reference">#${order.id}</div>
                <div class="order-status ${order.status || 'en-attente'}">${getStatusLabel(order.status)}</div>
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <div class="order-detail-label">Client</div>
                    <div class="order-detail-value">${order.customerName || 'Non renseigné'}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Date</div>
                    <div class="order-detail-value">${formatDate(order.date)}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Montant</div>
                    <div class="order-detail-value">${formatPrice(order.price)} DH</div>
                </div>
            </div>
            <div class="order-products">
                <div class="order-products-title">Produits :</div>
                <div class="order-product-list">
                    ${Array.isArray(order.products) ? 
                        order.products.map(p => `<span class="order-product-item">${p.name} (x${p.quantity})</span>`).join('') :
                        `<span class="order-product-item">${order.product || 'Produit non renseigné'}</span>`
                    }
                </div>
            </div>
            <div class="order-actions">
                <button class="btn-small btn-view" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Voir
                </button>
                <button class="btn-small btn-edit" onclick="editOrder('${order.id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn-small btn-delete" onclick="deleteOrder('${order.id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');

    // Mettre à jour le compteur
    document.getElementById('orders-count').textContent = `${filteredOrders.length} commande(s)`;
    
    // Mettre à jour les statistiques
    updateOrdersStats(orders);
}

// Mettre à jour les statistiques
function updateOrdersStats(orders) {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'livree' || o.status === 'delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'en-attente' || o.status === 'pending').length;
    const urgentOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        const daysDiff = (new Date() - orderDate) / (1000 * 60 * 60 * 24);
        return daysDiff > 7 && (o.status === 'en-attente' || o.status === 'pending');
    }).length;

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('urgent-orders').textContent = urgentOrders;
}

// Obtenir le libellé du statut
function getStatusLabel(status) {
    const statusMap = {
        'en-attente': 'En attente',
        'pending': 'En attente',
        'confirmee': 'Confirmée',
        'confirmed': 'Confirmée',
        'en-preparation': 'En préparation',
        'processing': 'En préparation',
        'expediee': 'Expédiée',
        'shipped': 'Expédiée',
        'livree': 'Livrée',
        'delivered': 'Livrée',
        'annulee': 'Annulée',
        'cancelled': 'Annulée'
    };
    return statusMap[status] || status || 'En attente';
}

// Formater une date
function formatDate(dateString) {
    if (!dateString) return 'Non renseignée';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// Formater un prix
function formatPrice(price) {
    if (typeof price !== 'number') price = parseFloat(price) || 0;
    return price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Appliquer les filtres actuels
function applyCurrentFilters(orders) {
    let filtered = [...orders];

    // Filtre par statut
    const statusFilter = document.getElementById('filter-status')?.value;
    if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtre par période
    const periodFilter = document.getElementById('filter-period')?.value;
    if (periodFilter) {
        const now = new Date();
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            switch (periodFilter) {
                case 'today':
                    return orderDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return orderDate >= weekAgo;
                case 'month':
                    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                case 'year':
                    return orderDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }

    // Filtre par recherche
    const searchFilter = document.getElementById('search-orders')?.value?.toLowerCase();
    if (searchFilter) {
        filtered = filtered.filter(order => 
            order.customerName?.toLowerCase().includes(searchFilter) ||
            order.id?.toLowerCase().includes(searchFilter) ||
            order.product?.toLowerCase().includes(searchFilter)
        );
    }

    return filtered;
}

// Fonctions d'action pour les commandes
function viewOrderDetails(orderId) {
    const order = window.orderManager.orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('order-modal');
    const content = document.getElementById('order-modal-content');
    
    content.innerHTML = `
        <div class="order-details-full">
            <div class="detail-section">
                <h4>Informations générales</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Référence :</label>
                        <span>#${order.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>Date :</label>
                        <span>${formatDate(order.date)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Statut :</label>
                        <span class="order-status ${order.status || 'en-attente'}">${getStatusLabel(order.status)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Montant :</label>
                        <span>${formatPrice(order.price)} DH</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Informations client</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Nom :</label>
                        <span>${order.customerName || 'Non renseigné'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Téléphone :</label>
                        <span>${order.customerPhone || 'Non renseigné'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Adresse :</label>
                        <span>${order.customerAddress || 'Non renseignée'}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Produits commandés</h4>
                <div class="products-detail">
                    ${Array.isArray(order.products) ? 
                        order.products.map(p => `
                            <div class="product-detail-item">
                                <span class="product-name">${p.name}</span>
                                <span class="product-quantity">Quantité: ${p.quantity}</span>
                                <span class="product-price">${formatPrice(p.price)} DH</span>
                            </div>
                        `).join('') :
                        `<div class="product-detail-item">
                            <span class="product-name">${order.product || 'Produit non renseigné'}</span>
                            <span class="product-price">${formatPrice(order.price)} DH</span>
                        </div>`
                    }
                </div>
            </div>

            ${order.notes ? `
                <div class="detail-section">
                    <h4>Notes</h4>
                    <p>${order.notes}</p>
                </div>
            ` : ''}
        </div>
    `;

    modal.style.display = 'block';
}

function closeOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

function editOrder(orderId) {
    // TODO: Ouvrir une modal d'édition de commande
    console.log('Édition de la commande:', orderId);
    showNotification('Fonctionnalité d\'édition en cours de développement', 'info');
}

function deleteOrder(orderId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        window.orderManager.deleteOrder(orderId);
        displayOrdersInAdmin();
        showNotification('Commande supprimée avec succès', 'success');
    }
}

function refreshOrders() {
    window.orderManager.loadOrders();
    displayOrdersInAdmin();
    showNotification('Commandes actualisées', 'success');
}

function applyOrderFilters() {
    displayOrdersInAdmin();
}

function exportOrdersCSV() {
    const orders = window.orderManager.orders;
    if (orders.length === 0) {
        showNotification('Aucune commande à exporter', 'warning');
        return;
    }

    const csvContent = window.orderManager.exportOrdersToCSV();
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Export CSV téléchargé avec succès', 'success');
}

// Fonction globale pour mettre à jour l'affichage (appelée par les événements storage)
window.updateOrdersDisplay = displayOrdersInAdmin;

// Initialiser l'affichage des commandes au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('orders-container')) {
        displayOrdersInAdmin();
        
        // Configurer les écouteurs d'événements pour les filtres
        const statusFilter = document.getElementById('filter-status');
        const periodFilter = document.getElementById('filter-period');
        const searchFilter = document.getElementById('search-orders');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', applyOrderFilters);
        }
        if (periodFilter) {
            periodFilter.addEventListener('change', applyOrderFilters);
        }
        if (searchFilter) {
            searchFilter.addEventListener('input', applyOrderFilters);
        }
    }
});

// Écouter les nouvelles commandes depuis l'extérieur
window.addEventListener('newOrderReceived', function(e) {
    displayOrdersInAdmin();
    showNotification('Nouvelle commande reçue !', 'success');
});

// ============================================
// FONCTIONS MANQUANTES POUR L'INTERFACE ADMIN
// ============================================

// Fonction pour sauvegarder les modifications d'une commande
function saveOrderChanges() {
    // TODO: Implémenter l'édition de commande
    showNotification('Fonctionnalité de modification en cours de développement', 'info');
    closeOrderModal();
}

// Fonction pour exporter les données (produits + commandes)
function exportData() {
    const orders = window.orderManager.orders;
    const products = window.mirebProductManager ? window.mirebProductManager.products : [];
    const categories = window.mirebProductManager ? window.mirebProductManager.categories : [];
    
    const exportData = {
        timestamp: new Date().toISOString(),
        orders: orders,
        products: products,
        categories: categories,
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mireb_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Export JSON téléchargé avec succès', 'success');
}

// Fonction pour forcer la synchronisation
function forcSync() {
    window.orderManager.loadOrders();
    if (window.mirebProductManager) {
        window.mirebProductManager.loadProducts();
        window.mirebProductManager.loadCategories();
    }
    
    // Mettre à jour l'affichage
    if (typeof displayOrdersInAdmin === 'function') {
        displayOrdersInAdmin();
    }
    
    // Déclencher les événements de synchronisation
    window.dispatchEvent(new CustomEvent('syncForced', {
        detail: { timestamp: Date.now() }
    }));
    
    showNotification('Synchronisation forcée effectuée', 'success');
}

// Fonction pour réinitialiser les données
function resetData() {
    if (confirm('⚠️ ATTENTION ⚠️\n\nCette action va supprimer TOUTES les données :\n- Toutes les commandes\n- Tous les produits\n- Toutes les catégories\n\nÊtes-vous absolument sûr de vouloir continuer ?')) {
        if (confirm('Dernière confirmation : Voulez-vous vraiment TOUT supprimer ?')) {
            // Supprimer toutes les données du localStorage
            localStorage.removeItem('commandes');
            localStorage.removeItem('products');
            localStorage.removeItem('categories');
            localStorage.removeItem('clients');
            
            // Réinitialiser les gestionnaires
            window.orderManager.orders = [];
            if (window.mirebProductManager) {
                window.mirebProductManager.products = [];
                window.mirebProductManager.categories = [];
            }
            
            // Mettre à jour l'affichage
            if (typeof displayOrdersInAdmin === 'function') {
                displayOrdersInAdmin();
            }
            
            showNotification('Toutes les données ont été supprimées', 'success');
        }
    }
}

// Fonction pour importer des données depuis un fichier JSON
function importData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Veuillez sélectionner un fichier JSON', 'warning');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Vérifier la structure des données
            if (importedData.orders) {
                localStorage.setItem('commandes', JSON.stringify(importedData.orders));
                window.orderManager.loadOrders();
            }
            
            if (importedData.products && window.mirebProductManager) {
                localStorage.setItem('products', JSON.stringify(importedData.products));
                window.mirebProductManager.loadProducts();
            }
            
            if (importedData.categories && window.mirebProductManager) {
                localStorage.setItem('categories', JSON.stringify(importedData.categories));
                window.mirebProductManager.loadCategories();
            }
            
            // Mettre à jour l'affichage
            if (typeof displayOrdersInAdmin === 'function') {
                displayOrdersInAdmin();
            }
            
            showNotification('Import réussi ! Données restaurées.', 'success');
            
            // Réinitialiser le champ de fichier
            fileInput.value = '';
            
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            showNotification('Erreur : Fichier JSON invalide', 'error');
        }
    };
    
    reader.readAsText(file);
}
