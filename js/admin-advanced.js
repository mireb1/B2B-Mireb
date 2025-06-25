// Script avancé pour l'interface d'administration
// Fonctionnalités : CRM, Livraisons, Marketing, Communication, Analytics

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Interface admin avancée initialisée');

    // Données simulées
    let categories = [
        { id: 1, name: 'Électronique', description: 'Appareils électroniques', icon: 'fas fa-laptop', color: '#667eea' },
        { id: 2, name: 'Mode', description: 'Vêtements et accessoires', icon: 'fas fa-tshirt', color: '#764ba2' },
        { id: 3, name: 'Maison', description: 'Articles pour la maison', icon: 'fas fa-home', color: '#f093fb' }
    ];

    let clients = [
        {
            id: 1,
            firstname: 'Jean',
            lastname: 'Dupont',
            email: 'jean.dupont@email.com',
            phone: '+33123456789',
            company: 'Tech Solutions',
            status: 'active',
            city: 'Paris',
            address: '123 Rue de la République',
            postal: '75001',
            country: 'France',
            notes: 'Client fidèle depuis 2 ans',
            tags: 'VIP, Fidèle',
            orders: 15,
            totalValue: 2500,
            lastActivity: '2025-06-20'
        },
        {
            id: 2,
            firstname: 'Marie',
            lastname: 'Martin',
            email: 'marie.martin@email.com',
            phone: '+33987654321',
            company: 'Design Studio',
            status: 'vip',
            city: 'Lyon',
            address: '456 Avenue des Arts',
            postal: '69000',
            country: 'France',
            notes: 'Intéressée par les nouveautés',
            tags: 'VIP, Designer',
            orders: 28,
            totalValue: 4200,
            lastActivity: '2025-06-22'
        }
    ];

    let deliveries = [
        {
            id: 1,
            trackingNumber: 'MRB2025001',
            orderId: 1,
            clientName: 'Jean Dupont',
            address: '123 Rue de la République, 75001 Paris',
            products: 'Ordinateur portable + Souris',
            driver: 'Jean Martin',
            status: 'shipped',
            scheduledDate: '2025-06-25 14:00',
            notes: 'Livraison au 2ème étage'
        }
    ];

    let leads = [
        {
            id: 1,
            name: 'Sophie Laurent',
            email: 'sophie.laurent@email.com',
            phone: '+33555666777',
            source: 'Facebook',
            interest: 'Électronique',
            status: 'new'
        }
    ];

    let communications = {
        calls: [
            {
                id: 1,
                clientName: 'Jean Dupont',
                phone: '+33123456789',
                date: '2025-06-24 10:30',
                duration: '5 min',
                notes: 'Suivi de commande',
                status: 'completed'
            }
        ],
        sms: [
            {
                id: 1,
                clientName: 'Marie Martin',
                phone: '+33987654321',
                content: 'Votre commande est prête pour la livraison',
                date: '2025-06-24 09:15',
                status: 'sent'
            }
        ]
    };

    // Initialisation des onglets
    initializeTabs();
    
    // Initialisation des fonctionnalités
    initializeProductsCategories();
    initializeCRM();
    initializeDeliveries();
    initializeMarketing();
    initializeCommunication();
    initializeAnalytics();

    // Gestion des onglets
    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.admin-tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Désactiver tous les onglets
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Activer l'onglet sélectionné
                button.classList.add('active');
                document.getElementById(tabId + '-tab').classList.add('active');

                // Charger les données spécifiques à l'onglet
                loadTabData(tabId);
            });
        });
    }

    function loadTabData(tabId) {
        switch(tabId) {
            case 'products':
                loadCategories();
                loadProducts();
                break;
            case 'clients':
                loadClients();
                updateCRMStats();
                break;
            case 'delivery':
                loadDeliveries();
                updateDeliveryStats();
                break;
            case 'marketing':
                loadLeads();
                updateMarketingStats();
                break;
            case 'communication':
                loadCommunications();
                updateCommunicationStats();
                break;
            case 'analytics':
                updateAnalytics();
                break;
        }
    }

    // === GESTION PRODUITS & CATÉGORIES ===
    function initializeProductsCategories() {
        // Boutons d'ajout
        document.getElementById('add-category-btn')?.addEventListener('click', () => openCategoryModal());
        document.getElementById('add-product-btn')?.addEventListener('click', () => openProductModal());

        // Formulaires
        document.getElementById('category-form')?.addEventListener('submit', handleCategorySubmit);
        document.getElementById('product-form')?.addEventListener('submit', handleProductSubmit);

        // Fermeture des modales
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Boutons d'annulation
        document.getElementById('cancel-category')?.addEventListener('click', () => {
            document.getElementById('category-modal').style.display = 'none';
        });
        document.getElementById('cancel-product')?.addEventListener('click', () => {
            document.getElementById('product-modal').style.display = 'none';
        });

        loadCategories();
    }

    function loadCategories() {
        const container = document.getElementById('admin-categories');
        if (!container) return;

        container.innerHTML = categories.map(category => `
            <div class="category-card" style="border-left: 4px solid ${category.color}">
                <i class="${category.icon}" style="color: ${category.color}"></i>
                <h5>${category.name}</h5>
                <p>${category.description}</p>
                <div class="category-actions">
                    <button onclick="editCategory(${category.id})" class="primary-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCategory(${category.id})" class="danger-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Mettre à jour le select des catégories dans le formulaire produit
        const categorySelect = document.getElementById('product-category');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>' +
                categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
        
        // Synchroniser automatiquement à chaque chargement
        syncWithHomepage();
    }

    function openCategoryModal(categoryId = null) {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        const form = document.getElementById('category-form');

        if (categoryId) {
            const category = categories.find(c => c.id === categoryId);
            title.textContent = 'Modifier la catégorie';
            document.getElementById('category-id').value = category.id;
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-description').value = category.description;
            document.getElementById('category-icon').value = category.icon;
            document.getElementById('category-color').value = category.color;
        } else {
            title.textContent = 'Nouvelle catégorie';
            form.reset();
            document.getElementById('category-id').value = '';
        }

        modal.style.display = 'flex';
    }

    function handleCategorySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const categoryData = {
            name: document.getElementById('category-name').value,
            description: document.getElementById('category-description').value,
            icon: document.getElementById('category-icon').value,
            color: document.getElementById('category-color').value
        };

        const categoryId = document.getElementById('category-id').value;

        if (categoryId) {
            // Modification
            const index = categories.findIndex(c => c.id == categoryId);
            categories[index] = { ...categories[index], ...categoryData };
            showNotification('Catégorie modifiée avec succès !', 'success');
        } else {
            // Ajout
            const newCategory = {
                id: Date.now(),
                ...categoryData
            };
            categories.push(newCategory);
            showNotification('Catégorie ajoutée avec succès !', 'success');
        }

        loadCategories();
        syncWithHomepage(); // SYNCHRONISATION AUTOMATIQUE
        document.getElementById('category-modal').style.display = 'none';
    }

    // === GESTION CRM ===
    function initializeCRM() {
        document.getElementById('add-client-btn')?.addEventListener('click', () => openClientModal());
        document.getElementById('client-form')?.addEventListener('submit', handleClientSubmit);

        // Onglets client
        document.querySelectorAll('.client-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                
                document.querySelectorAll('.client-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.client-tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(tabId + '-tab').classList.add('active');
            });
        });

        loadClients();
    }

    function loadClients() {
        const tbody = document.querySelector('#clients-table tbody');
        if (!tbody) return;

        tbody.innerHTML = clients.map(client => `
            <tr>
                <td>
                    <div class="client-avatar">
                        <i class="fas fa-user-circle fa-2x"></i>
                    </div>
                </td>
                <td>${client.firstname} ${client.lastname}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.city}</td>
                <td>
                    <span class="client-status ${client.status}">
                        ${client.status.toUpperCase()}
                    </span>
                </td>
                <td>${client.orders}</td>
                <td>${client.totalValue} €</td>
                <td>${client.lastActivity}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editClient(${client.id})" class="primary-btn" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="callClient('${client.phone}')" class="success-btn" title="Appeler">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button onclick="sendSMS('${client.phone}')" class="secondary-btn" title="SMS">
                            <i class="fas fa-sms"></i>
                        </button>
                        <button onclick="deleteClient(${client.id})" class="danger-btn" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function openClientModal(clientId = null) {
        const modal = document.getElementById('client-modal');
        const title = document.getElementById('client-modal-title');

        if (clientId) {
            const client = clients.find(c => c.id === clientId);
            title.textContent = 'Modifier le client';
            // Remplir le formulaire avec les données du client
            Object.keys(client).forEach(key => {
                const input = document.getElementById('client-' + key);
                if (input) input.value = client[key];
            });
        } else {
            title.textContent = 'Nouveau client';
            document.getElementById('client-form').reset();
        }

        modal.style.display = 'flex';
    }

    function handleClientSubmit(e) {
        e.preventDefault();
        
        const clientData = {
            firstname: document.getElementById('client-firstname').value,
            lastname: document.getElementById('client-lastname').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value,
            company: document.getElementById('client-company').value,
            status: document.getElementById('client-status').value,
            address: document.getElementById('client-address').value,
            city: document.getElementById('client-city').value,
            postal: document.getElementById('client-postal').value,
            country: document.getElementById('client-country').value,
            notes: document.getElementById('client-notes').value,
            tags: document.getElementById('client-tags').value
        };

        const clientId = document.getElementById('client-id').value;

        if (clientId) {
            // Modification
            const index = clients.findIndex(c => c.id == clientId);
            clients[index] = { ...clients[index], ...clientData };
            showNotification('Client modifié avec succès !', 'success');
        } else {
            // Ajout
            const newClient = {
                id: Date.now(),
                ...clientData,
                orders: 0,
                totalValue: 0,
                lastActivity: new Date().toISOString().split('T')[0]
            };
            clients.push(newClient);
            showNotification('Client ajouté avec succès !', 'success');
        }

        loadClients();
        updateCRMStats();
        document.getElementById('client-modal').style.display = 'none';
    }

    function updateCRMStats() {
        document.getElementById('total-clients').textContent = clients.length;
        document.getElementById('new-clients').textContent = clients.filter(c => {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return new Date(c.lastActivity) > lastMonth;
        }).length;
        document.getElementById('vip-clients').textContent = clients.filter(c => c.status === 'vip').length;
        document.getElementById('total-revenue').textContent = clients.reduce((sum, c) => sum + c.totalValue, 0) + ' €';
    }

    // === GESTION LIVRAISONS ===
    function initializeDeliveries() {
        document.getElementById('add-delivery-btn')?.addEventListener('click', () => openDeliveryModal());
        document.getElementById('delivery-form')?.addEventListener('submit', handleDeliverySubmit);
        
        loadDeliveries();
    }

    function loadDeliveries() {
        const tbody = document.querySelector('#deliveries-table tbody');
        if (!tbody) return;

        tbody.innerHTML = deliveries.map(delivery => `
            <tr>
                <td><strong>${delivery.trackingNumber}</strong></td>
                <td>${delivery.clientName}</td>
                <td>${delivery.address}</td>
                <td>${delivery.products}</td>
                <td>${delivery.driver}</td>
                <td>
                    <span class="delivery-status ${delivery.status}">
                        ${getDeliveryStatusText(delivery.status)}
                    </span>
                </td>
                <td>${formatDateTime(delivery.scheduledDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="trackDelivery('${delivery.trackingNumber}')" class="primary-btn" title="Suivre">
                            <i class="fas fa-map-marker-alt"></i>
                        </button>
                        <button onclick="editDelivery(${delivery.id})" class="secondary-btn" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function getDeliveryStatusText(status) {
        const statusMap = {
            pending: 'En attente',
            processing: 'En préparation',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            failed: 'Échec'
        };
        return statusMap[status] || status;
    }

    function updateDeliveryStats() {
        document.getElementById('pending-deliveries').textContent = deliveries.filter(d => d.status === 'pending').length;
        document.getElementById('active-deliveries').textContent = deliveries.filter(d => d.status === 'shipped').length;
        document.getElementById('completed-deliveries').textContent = deliveries.filter(d => d.status === 'delivered').length;
        document.getElementById('failed-deliveries').textContent = deliveries.filter(d => d.status === 'failed').length;
    }

    // === GESTION MARKETING ===
    function initializeMarketing() {
        document.getElementById('sync-facebook-leads')?.addEventListener('click', syncFacebookLeads);
        document.getElementById('sync-instagram-leads')?.addEventListener('click', syncInstagramLeads);
        document.getElementById('schedule-post')?.addEventListener('click', schedulePost);
        
        loadLeads();
    }

    function loadLeads() {
        const tbody = document.querySelector('#leads-table tbody');
        if (!tbody) return;

        tbody.innerHTML = leads.map(lead => `
            <tr>
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.phone}</td>
                <td>
                    <span class="lead-source ${lead.source.toLowerCase()}">
                        <i class="fab fa-${lead.source.toLowerCase()}"></i> ${lead.source}
                    </span>
                </td>
                <td>${lead.interest}</td>
                <td>
                    <span class="lead-status ${lead.status}">
                        ${lead.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="convertLead(${lead.id})" class="success-btn" title="Convertir">
                            <i class="fas fa-user-plus"></i>
                        </button>
                        <button onclick="contactLead(${lead.id})" class="primary-btn" title="Contacter">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function syncFacebookLeads() {
        showNotification('Synchronisation Facebook en cours...', 'info');
        // Simulation de synchronisation
        setTimeout(() => {
            const newLeads = [
                {
                    id: Date.now(),
                    name: 'Paul Durand',
                    email: 'paul.durand@email.com',
                    phone: '+33444555666',
                    source: 'Facebook',
                    interest: 'Mode',
                    status: 'new'
                }
            ];
            leads.push(...newLeads);
            loadLeads();
            updateMarketingStats();
            showNotification(`${newLeads.length} nouveaux leads Facebook importés !`, 'success');
        }, 2000);
    }

    function syncInstagramLeads() {
        showNotification('Synchronisation Instagram en cours...', 'info');
        // Simulation de synchronisation
        setTimeout(() => {
            const newLeads = [
                {
                    id: Date.now() + 1,
                    name: 'Claire Bernard',
                    email: 'claire.bernard@email.com',
                    phone: '+33777888999',
                    source: 'Instagram',
                    interest: 'Maison',
                    status: 'new'
                }
            ];
            leads.push(...newLeads);
            loadLeads();
            updateMarketingStats();
            showNotification(`${newLeads.length} nouveaux leads Instagram importés !`, 'success');
        }, 2000);
    }

    function schedulePost() {
        const content = document.getElementById('post-content').value;
        const category = document.getElementById('post-category').value;
        const facebook = document.getElementById('publish-facebook').checked;
        const instagram = document.getElementById('publish-instagram').checked;
        const linkedin = document.getElementById('publish-linkedin').checked;

        if (!content.trim()) {
            showNotification('Veuillez saisir un contenu pour la publication', 'error');
            return;
        }

        const platforms = [];
        if (facebook) platforms.push('Facebook');
        if (instagram) platforms.push('Instagram');
        if (linkedin) platforms.push('LinkedIn');

        if (platforms.length === 0) {
            showNotification('Veuillez sélectionner au moins une plateforme', 'error');
            return;
        }

        showNotification(`Publication programmée sur ${platforms.join(', ')} !`, 'success');
        
        // Réinitialiser le formulaire
        document.getElementById('post-content').value = '';
        document.getElementById('publish-facebook').checked = false;
        document.getElementById('publish-instagram').checked = false;
        document.getElementById('publish-linkedin').checked = false;
    }

    function updateMarketingStats() {
        document.getElementById('facebook-leads').textContent = leads.filter(l => l.source === 'Facebook').length;
        document.getElementById('instagram-leads').textContent = leads.filter(l => l.source === 'Instagram').length;
        document.getElementById('conversion-rate').textContent = '12.5%'; // Simulation
        document.getElementById('marketing-roi').textContent = '245%'; // Simulation
    }

    // === GESTION COMMUNICATION ===
    function initializeCommunication() {
        document.getElementById('new-call-btn')?.addEventListener('click', () => openCallModal());
        document.getElementById('new-sms-btn')?.addEventListener('click', () => openSMSModal());
        document.getElementById('whatsapp-btn')?.addEventListener('click', openWhatsApp);
        
        document.getElementById('call-form')?.addEventListener('submit', handleCallSubmit);
        document.getElementById('sms-form')?.addEventListener('submit', handleSMSSubmit);

        // Compteur de caractères SMS
        document.getElementById('sms-content')?.addEventListener('input', (e) => {
            const remaining = 160 - e.target.value.length;
            document.getElementById('sms-counter').textContent = remaining;
        });

        loadCommunications();
    }

    function loadCommunications() {
        const callsList = document.getElementById('calls-list');
        if (callsList) {
            callsList.innerHTML = communications.calls.map(call => `
                <div class="call-item">
                    <div class="call-header">
                        <strong>${call.clientName}</strong>
                        <span class="call-date">${call.date}</span>
                    </div>
                    <div class="call-details">
                        <p><i class="fas fa-phone"></i> ${call.phone}</p>
                        <p><i class="fas fa-clock"></i> ${call.duration}</p>
                        <p><i class="fas fa-note-sticky"></i> ${call.notes}</p>
                    </div>
                </div>
            `).join('');
        }

        const messagesList = document.getElementById('messages-list');
        if (messagesList) {
            messagesList.innerHTML = communications.sms.map(sms => `
                <div class="message-item">
                    <div class="message-header">
                        <strong>${sms.clientName}</strong>
                        <span class="message-date">${sms.date}</span>
                    </div>
                    <div class="message-content">
                        <p>${sms.content}</p>
                        <span class="message-status ${sms.status}">
                            <i class="fas fa-check"></i> ${sms.status}
                        </span>
                    </div>
                </div>
            `).join('');
        }

        // Remplir les selects clients
        const clientSelects = document.querySelectorAll('#contact-client, #call-client, #sms-client');
        clientSelects.forEach(select => {
            if (select) {
                select.innerHTML = '<option value="">Sélectionner un client</option>' +
                    clients.map(client => `
                        <option value="${client.id}" data-phone="${client.phone}">
                            ${client.firstname} ${client.lastname}
                        </option>
                    `).join('');
            }
        });
    }

    function openCallModal() {
        document.getElementById('call-modal').style.display = 'flex';
    }

    function openSMSModal() {
        document.getElementById('sms-modal').style.display = 'flex';
    }

    function openWhatsApp() {
        const phone = prompt('Numéro de téléphone (avec indicatif pays):');
        if (phone) {
            const message = prompt('Message à envoyer:');
            if (message) {
                const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                showNotification('WhatsApp ouvert !', 'success');
            }
        }
    }

    function handleCallSubmit(e) {
        e.preventDefault();
        
        const clientSelect = document.getElementById('call-client');
        const clientId = clientSelect.value;
        const clientName = clientSelect.options[clientSelect.selectedIndex].text;
        const phone = document.getElementById('call-phone').value;
        const notes = document.getElementById('call-notes').value;

        // Simuler l'appel
        const newCall = {
            id: Date.now(),
            clientName: clientName,
            phone: phone,
            date: new Date().toLocaleString('fr-FR'),
            duration: '-- en cours --',
            notes: notes,
            status: 'in-progress'
        };

        communications.calls.unshift(newCall);
        loadCommunications();
        updateCommunicationStats();
        
        document.getElementById('call-modal').style.display = 'none';
        document.getElementById('call-form').reset();
        
        // Simuler la fin d'appel après 30 secondes
        setTimeout(() => {
            newCall.duration = '3 min 45s';
            newCall.status = 'completed';
            loadCommunications();
        }, 3000);

        showNotification('Appel en cours...', 'info');
    }

    function handleSMSSubmit(e) {
        e.preventDefault();
        
        const clientSelect = document.getElementById('sms-client');
        const clientId = clientSelect.value;
        const clientName = clientSelect.options[clientSelect.selectedIndex].text;
        const phone = document.getElementById('sms-phone').value;
        const content = document.getElementById('sms-content').value;

        const newSMS = {
            id: Date.now(),
            clientName: clientName,
            phone: phone,
            content: content,
            date: new Date().toLocaleString('fr-FR'),
            status: 'sent'
        };

        communications.sms.unshift(newSMS);
        loadCommunications();
        updateCommunicationStats();
        
        document.getElementById('sms-modal').style.display = 'none';
        document.getElementById('sms-form').reset();
        document.getElementById('sms-counter').textContent = '160';

        showNotification('SMS envoyé avec succès !', 'success');
    }

    function updateCommunicationStats() {
        const today = new Date().toDateString();
        document.getElementById('today-calls').textContent = communications.calls.filter(call => 
            new Date(call.date).toDateString() === today
        ).length;
        document.getElementById('sent-sms').textContent = communications.sms.length;
        document.getElementById('whatsapp-messages').textContent = '0'; // Simulation
        document.getElementById('response-rate').textContent = '85%'; // Simulation
    }

    // === ANALYTICS ===
    function initializeAnalytics() {
        document.getElementById('analytics-period')?.addEventListener('change', updateAnalytics);
        updateAnalytics();
    }

    function updateAnalytics() {
        // Mise à jour des statistiques générales
        document.getElementById('unique-visitors').textContent = '1,247';
        document.getElementById('conversion-rate-analytics').textContent = '3.2%';
        document.getElementById('revenue-analytics').textContent = '15,680 €';
        document.getElementById('new-customers').textContent = '28';

        // Ici on pourrait intégrer de vrais graphiques avec Chart.js
        // Pour le moment, on simule juste les données
    }

    // === SYNCHRONISATION AVEC LA PAGE D'ACCUEIL ===
    function syncWithHomepage() {
        try {
            // Sauvegarder les catégories
            localStorage.setItem('mireb_categories', JSON.stringify(categories));
            
            // Sauvegarder les produits (si définis)
            if (typeof products !== 'undefined') {
                localStorage.setItem('mireb_products', JSON.stringify(products));
            }
            
            // Déclencher un événement pour notifier la page d'accueil
            window.dispatchEvent(new CustomEvent('adminDataUpdated', {
                detail: {
                    categories: categories,
                    products: typeof products !== 'undefined' ? products : [],
                    timestamp: Date.now()
                }
            }));
            
            console.log('🔄 Données synchronisées avec la page d\'accueil', {
                categories: categories.length,
                products: typeof products !== 'undefined' ? products.length : 0
            });
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation:', error);
        }
    }

    // === GESTION PRODUITS ===
    let products = [
        {
            id: 1,
            name: 'MacBook Pro 16"',
            category: 1,
            price: 2499,
            description: 'Ordinateur portable haute performance pour professionnels',
            image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
            stock: 15,
            featured: true,
            status: 'active'
        },
        {
            id: 2,
            name: 'iPhone 15 Pro',
            category: 1,
            price: 1199,
            description: 'Smartphone dernière génération avec puce A17 Pro',
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
            stock: 25,
            featured: true,
            status: 'active'
        },
        {
            id: 3,
            name: 'Robe élégante',
            category: 2,
            price: 89,
            description: 'Robe de soirée élégante pour occasions spéciales',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
            stock: 12,
            featured: false,
            status: 'active'
        },
        {
            id: 4,
            name: 'Canapé moderne',
            category: 3,
            price: 1299,
            description: 'Canapé 3 places design moderne et confortable',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            stock: 5,
            featured: true,
            status: 'active'
        }
    ];

    function loadProducts() {
        const container = document.getElementById('admin-products');
        if (!container) return;

        container.innerHTML = products.map(product => {
            const category = categories.find(c => c.id === product.category);
            return `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                        ${product.featured ? '<span class="featured-badge">★ Vedette</span>' : ''}
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <p class="product-category">${category ? category.name : 'Sans catégorie'}</p>
                        <p class="product-description">${product.description}</p>
                        <div class="product-details">
                            <span class="product-price">${product.price} €</span>
                            <span class="product-stock">Stock: ${product.stock}</span>
                        </div>
                        <div class="product-actions">
                            <button onclick="editProduct(${product.id})" class="primary-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteProduct(${product.id})" class="danger-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button onclick="toggleFeatured(${product.id})" class="secondary-btn">
                                <i class="fas fa-star"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function openProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        if (productId) {
            const product = products.find(p => p.id === productId);
            title.textContent = 'Modifier le produit';
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-featured').checked = product.featured;
            document.getElementById('product-status').value = product.status;
        } else {
            title.textContent = 'Nouveau produit';
            form.reset();
            document.getElementById('product-id').value = '';
        }

        modal.style.display = 'flex';
    }

    function handleProductSubmit(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('product-name').value,
            category: parseInt(document.getElementById('product-category').value),
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value || 'https://via.placeholder.com/300x200?text=Produit',
            stock: parseInt(document.getElementById('product-stock').value),
            featured: document.getElementById('product-featured').checked,
            status: document.getElementById('product-status').value
        };

        const productId = document.getElementById('product-id').value;

        if (productId) {
            // Modification
            const index = products.findIndex(p => p.id == productId);
            products[index] = { ...products[index], ...productData };
            showNotification('Produit modifié avec succès !', 'success');
        } else {
            // Ajout
            const newProduct = {
                id: Date.now(),
                ...productData
            };
            products.push(newProduct);
            showNotification('Produit ajouté avec succès !', 'success');
        }

        loadProducts();
        syncWithHomepage(); // SYNCHRONISATION AUTOMATIQUE
        document.getElementById('product-modal').style.display = 'none';
    }

    function deleteProduct(productId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            products = products.filter(p => p.id !== productId);
            loadProducts();
            syncWithHomepage(); // SYNCHRONISATION AUTOMATIQUE
            showNotification('Produit supprimé avec succès !', 'success');
        }
    }

    function editProduct(productId) {
        openProductModal(productId);
    }

    function toggleFeatured(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            product.featured = !product.featured;
            loadProducts();
            syncWithHomepage(); // SYNCHRONISATION AUTOMATIQUE
            showNotification(`Produit ${product.featured ? 'ajouté aux' : 'retiré des'} vedettes !`, 'success');
        }
    }

    function deleteCategory(categoryId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            categories = categories.filter(c => c.id !== categoryId);
            loadCategories();
            syncWithHomepage(); // SYNCHRONISATION AUTOMATIQUE
            showNotification('Catégorie supprimée avec succès !', 'success');
        }
    }

    function editCategory(categoryId) {
        openCategoryModal(categoryId);
    }

    // Modifier la fonction handleCategorySubmit pour inclure la synchronisation
    function handleCategorySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const categoryData = {
            name: document.getElementById('category-name').value,
            description: document.getElementById('category-description').value,
            icon: document.getElementById('category-icon').value,
            color: document.getElementById('category-color').value
        };

        const categoryId = document.getElementById('category-id').value;

        if (categoryId) {
            // Modification
            const index = categories.findIndex(c => c.id == categoryId);
            categories[index] = { ...categories[index], ...categoryData };
            showNotification('Catégorie modifiée avec succès !', 'success');
        } else {
            // Ajout
            const newCategory = {
                id: Date.now(),
                ...categoryData
            };
            categories.push(newCategory);
            showNotification('Catégorie ajoutée avec succès !', 'success');
        }

        loadCategories();
        syncWithHomepage(); // SYNCHRONISATION AUTOMATIQUE
        document.getElementById('category-modal').style.display = 'none';
    }

    // Synchroniser automatiquement au chargement
    setTimeout(() => {
        syncWithHomepage();
    }, 1000);

    // Exposer les fonctions globalement
    window.editCategory = editCategory;
    window.deleteCategory = deleteCategory;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.toggleFeatured = toggleFeatured;

    // Gestion de la connexion admin (simulation pour GitHub Pages)
    if (window.location.hostname.endsWith('github.io')) {
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('login-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = document.getElementById('admin-user').value.trim();
                    const pass = document.getElementById('admin-pass').value.trim();
                    const msg = document.getElementById('login-message');
                    const validCombos = [
                      { email: 'admin@mireb.com', pass: 'admin123' },
                      { email: 'mirebcommercial@gmail.com', pass: 'Fiacre-19' }
                    ];
                    const isValid = validCombos.some(c => c.email === email && c.pass === pass);
                    if (isValid) {
                        msg.innerHTML = '<span style="color:green">Connexion réussie (mode démo GitHub Pages)</span>';
                        document.getElementById('admin-login').style.display = 'none';
                        document.getElementById('admin-panel').style.display = '';
                    } else {
                        msg.innerHTML = '<span style="color:red">Identifiants invalides (mode démo GitHub Pages)</span>';
                    }
                });
            }
        });
    }
});

// Styles pour les notifications
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 300px;
    animation: slideIn 0.3s ease;
}

.notification.success {
    border-left: 4px solid #10b981;
    color: #065f46;
}

.notification.error {
    border-left: 4px solid #ef4444;
    color: #991b1b;
}

.notification.info {
    border-left: 4px solid #3b82f6;
    color: #1e40af;
}

.notification i {
    font-size: 1.2rem;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.client-status,
.lead-status,
.lead-source {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.client-status.active,
.lead-status.new {
    background: #dcfce7;
    color: #166534;
}

.client-status.vip {
    background: #fef3c7;
    color: #92400e;
}

.client-status.inactive {
    background: #f3f4f6;
    color: #374151;
}

.lead-source.facebook {
    background: #dbeafe;
    color: #1e40af;
}

.lead-source.instagram {
    background: #fce7f3;
    color: #be185d;
}

.action-buttons {
    display: flex;
    gap: 5px;
}

.action-buttons button {
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
}

.client-avatar {
    color: var(--primary-color);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Simulation de connexion admin pour GitHub Pages
if (window.location.hostname.endsWith('github.io')) {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('admin-user').value.trim();
                const pass = document.getElementById('admin-pass').value.trim();
                const msg = document.getElementById('login-message');
                const validCombos = [
                  { email: 'admin@mireb.com', pass: 'admin123' },
                  { email: 'mirebcommercial@gmail.com', pass: 'Fiacre-19' }
                ];
                const isValid = validCombos.some(c => c.email === email && c.pass === pass);
                if (isValid) {
                    msg.innerHTML = '<span style="color:green">Connexion réussie (mode démo GitHub Pages)</span>';
                    document.getElementById('admin-login').style.display = 'none';
                    document.getElementById('admin-panel').style.display = '';
                } else {
                    msg.innerHTML = '<span style="color:red">Identifiants invalides (mode démo GitHub Pages)</span>';
                }
            });
        }
    });
}
