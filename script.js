// Petite interaction pour le formulaire de contact et le bouton d'achat

document.addEventListener('DOMContentLoaded', function() {
    // Configuration des graphiques (pour l'admin)
    let ordersChart, productsChart;
    const ADMIN_EMAIL = 'mirebcommercial@gmail.com';
    const ADMIN_PASSWORD = 'Fiacre-19';
    
    // Liste des produits par défaut
    const defaultProducts = [
        {
            id: 1,
            name: 'Produit Premium Pro',
            category: 'premium',
            price: 499.99,
            description: 'Notre solution haut de gamme pour les grandes entreprises avec un support 24/7 et des fonctionnalités avancées.',
            image: 'https://via.placeholder.com/300x200/3f51b5/ffffff?text=Produit+Premium',
            stock: 25,
            rating: 5
        },
        {
            id: 2,
            name: 'Solution Business Plus',
            category: 'premium',
            price: 349.99,
            description: 'Idéal pour les entreprises moyennes avec des besoins d\'évolutivité et de personnalisation.',
            image: 'https://via.placeholder.com/300x200/303f9f/ffffff?text=Solution+Business',
            stock: 18,
            rating: 4.5
        },
        {
            id: 3,
            name: 'Solution Business',
            category: 'standard',
            price: 299.99,
            description: 'Notre offre équilibrée pour les PME avec un bon rapport qualité-prix et des fonctionnalités essentielles.',
            image: 'https://via.placeholder.com/300x200/5c6bc0/ffffff?text=Solution+Standard',
            stock: 32,
            rating: 4
        },
        {
            id: 4,
            name: 'Pack Professionnel',
            category: 'standard',
            price: 249.99,
            description: 'Un ensemble complet d\'outils pour les professionnels indépendants et les petites équipes.',
            image: 'https://via.placeholder.com/300x200/7986cb/ffffff?text=Pack+Pro',
            stock: 41,
            rating: 3.5
        },
        {
            id: 5,
            name: 'Pack Démarrage',
            category: 'basic',
            price: 199.99,
            description: 'La solution parfaite pour débuter avec un investissement minimal et les fonctionnalités essentielles.',
            image: 'https://via.placeholder.com/300x200/9fa8da/ffffff?text=Pack+Démarrage',
            stock: 50,
            rating: 3
        },
        {
            id: 6,
            name: 'Starter Kit',
            category: 'basic',
            price: 149.99,
            description: 'Notre offre d\'entrée de gamme pour les startups et très petites entreprises.',
            image: 'https://via.placeholder.com/300x200/c5cae9/ffffff?text=Starter+Kit',
            stock: 64,
            rating: 2.5
        }
    ];

    // Initialiser les produits dans le localStorage s'ils n'existent pas
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    // Liste des messages (vide par défaut)
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }

    // Liste des clients (vide par défaut)
    if (!localStorage.getItem('clients')) {
        localStorage.setItem('clients', JSON.stringify([]));
    }

    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('form-message');
            
            // Sauvegarder le message
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            const newMessage = {
                id: Date.now(),
                name: contactForm.nom.value,
                email: contactForm.email.value,
                subject: contactForm.sujet ? contactForm.sujet.value : 'Contact général',
                message: contactForm.message.value,
                date: new Date().toLocaleString(),
                read: false
            };
            
            messages.push(newMessage);
            localStorage.setItem('messages', JSON.stringify(messages));
            
            // Afficher confirmation
            formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.';
            formMessage.style.backgroundColor = '#4CAF50';
            formMessage.style.color = 'white';
            formMessage.style.padding = '10px';
            formMessage.style.borderRadius = '5px';
            contactForm.reset();
        });
    }

    // Gestion de la modale de commande et stockage des commandes
    const orderBtns = document.querySelectorAll('.order-btn');
    const orderModal = document.getElementById('order-modal');
    const closeModal = orderModal ? orderModal.querySelector('.close-modal') : null;
    const orderForm = document.getElementById('order-form');
    const produitCommande = document.getElementById('produit-commande');
    const orderMessage = document.getElementById('order-message');

    orderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = btn.getAttribute('data-produit');
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const product = products.find(p => p.name === productName);
            
            if (produitCommande) {
                produitCommande.value = productName;
                
                // Ajouter les détails du produit dans un champ caché
                if (!document.getElementById('produit-prix')) {
                    const priceInput = document.createElement('input');
                    priceInput.type = 'hidden';
                    priceInput.id = 'produit-prix';
                    priceInput.name = 'prix';
                    priceInput.value = product ? product.price : '';
                    orderForm.appendChild(priceInput);
                } else {
                    document.getElementById('produit-prix').value = product ? product.price : '';
                }
            }
            
            if (orderModal) orderModal.style.display = 'flex';
            if (orderMessage) orderMessage.textContent = '';
        });
    });

    if (closeModal) {
        closeModal.onclick = () => orderModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === orderModal) orderModal.style.display = 'none';
        
        const productModal = document.getElementById('product-modal');
        if (event.target === productModal) productModal.style.display = 'none';
    };

    if (orderForm) {
        orderForm.onsubmit = function(e) {
            e.preventDefault();
            const nom = orderForm.nom.value;
            const tel = orderForm.tel.value;
            const adresse = orderForm.adresse.value;
            const produit = produitCommande.value;
            const prix = document.getElementById('produit-prix') ? document.getElementById('produit-prix').value : '';
            const date = new Date().toLocaleString();
            const id = 'CMD' + Date.now();
            
            // Sauvegarder la commande
            let commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
            const nouvelleCommande = { 
                id, 
                nom, 
                tel, 
                adresse, 
                produit, 
                prix, 
                date,
                status: 'En attente' 
            };
            
            commandes.push(nouvelleCommande);
            localStorage.setItem('commandes', JSON.stringify(commandes));
            
            // Sauvegarder ou mettre à jour le client
            let clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const clientExistant = clients.findIndex(c => c.tel === tel);
            
            if (clientExistant === -1) {
                // Nouveau client
                clients.push({
                    id: 'CLT' + Date.now(),
                    nom,
                    tel,
                    adresse,
                    commandes: [id],
                    valeurTotale: parseFloat(prix || 0)
                });
            } else {
                // Client existant
                clients[clientExistant].commandes.push(id);
                clients[clientExistant].valeurTotale += parseFloat(prix || 0);
            }
            localStorage.setItem('clients', JSON.stringify(clients));
            
            // Confirmation
            orderMessage.innerHTML = '<i class="fas fa-check-circle"></i> Commande enregistrée ! Paiement à la réception.';
            orderMessage.style.color = '#4CAF50';
            orderForm.reset();
            
            // Ajouter activité
            ajouterActivite(`Nouvelle commande reçue de ${nom} pour ${produit}`);
            
            setTimeout(() => { orderModal.style.display = 'none'; }, 2000);
        };
    }

    // Filtres de la page produits
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Activer/désactiver les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            products.forEach(product => {
                if (category === 'all' || product.getAttribute('data-category') === category) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Admin login
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const adminLogin = document.getElementById('admin-login');
    const loginMessage = document.getElementById('login-message');
    
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const email = document.getElementById('admin-user').value;
            const pass = document.getElementById('admin-pass').value;
            
            if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
                adminLogin.style.display = 'none';
                adminPanel.style.display = 'block';
                
                // Initialiser le tableau de bord
                initialiserTableauBord();
                
                // Ajouter activité
                ajouterActivite('Administrateur connecté');
            } else {
                loginMessage.textContent = 'Identifiants incorrects.';
                loginMessage.style.color = 'red';
            }
        };
    }
    
    // Gestion des onglets d'administration
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tab = btn.getAttribute('data-tab');
                document.getElementById(`${tab}-tab`).classList.add('active');
                
                // Charger les données spécifiques à l'onglet
                switch (tab) {
                    case 'dashboard':
                        mettreAJourGraphiques();
                        break;
                    case 'orders':
                        afficherCommandes();
                        break;
                    case 'products':
                        afficherProduits();
                        break;
                    case 'clients':
                        afficherClients();
                        break;
                    case 'messages':
                        afficherMessages();
                        break;
                }
            });
        });
    }
    
    // Déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            adminPanel.style.display = 'none';
            adminLogin.style.display = 'block';
            document.getElementById('admin-user').value = '';
            document.getElementById('admin-pass').value = '';
            ajouterActivite('Administrateur déconnecté');
        };
    }
    
    // Gestion des produits
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeProductModal = productModal ? productModal.querySelector('.close-modal') : null;
    const productForm = document.getElementById('product-form');
    const cancelProductBtn = document.getElementById('cancel-product');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            document.getElementById('product-modal-title').textContent = 'Ajouter un produit';
            document.getElementById('product-id').value = '';
            productForm.reset();
            productModal.style.display = 'flex';
        });
    }
    
    if (closeProductModal) {
        closeProductModal.onclick = () => productModal.style.display = 'none';
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.onclick = () => productModal.style.display = 'none';
    }
    
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('product-id').value;
            const isEdit = productId !== '';
            
            const newProduct = {
                id: isEdit ? parseInt(productId) : Date.now(),
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                price: parseFloat(document.getElementById('product-price').value),
                description: document.getElementById('product-desc').value,
                stock: parseInt(document.getElementById('product-stock').value),
                image: document.getElementById('product-image').value || `https://via.placeholder.com/300x200/${getColorForCategory(document.getElementById('product-category').value)}/ffffff?text=${encodeURIComponent(document.getElementById('product-name').value)}`,
                rating: 0 // Nouveau produit, pas encore de notation
            };
            
            const products = JSON.parse(localStorage.getItem('products'));
            
            if (isEdit) {
                // Modifier un produit existant
                const index = products.findIndex(p => p.id === parseInt(productId));
                if (index !== -1) {
                    // Préserver la notation existante
                    newProduct.rating = products[index].rating;
                    products[index] = newProduct;
                    ajouterActivite(`Produit "${newProduct.name}" modifié`);
                }
            } else {
                // Ajouter un nouveau produit
                products.push(newProduct);
                ajouterActivite(`Nouveau produit "${newProduct.name}" ajouté`);
            }
            
            localStorage.setItem('products', JSON.stringify(products));
            productModal.style.display = 'none';
            afficherProduits();
            updateProductCount();
        });
    }
    
    // Fonction pour obtenir une couleur selon la catégorie
    function getColorForCategory(category) {
        switch(category) {
            case 'premium': return '3f51b5';
            case 'standard': return '5c6bc0';
            case 'basic': return '9fa8da';
            default: return 'c5cae9';
        }
    }
    
    // Gestion de la suppression et modification des produits
    function configurerActionsProduits() {
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const products = JSON.parse(localStorage.getItem('products'));
                const product = products.find(p => p.id === parseInt(productId));
                
                if (product) {
                    document.getElementById('product-modal-title').textContent = 'Modifier le produit';
                    document.getElementById('product-id').value = product.id;
                    document.getElementById('product-name').value = product.name;
                    document.getElementById('product-category').value = product.category;
                    document.getElementById('product-price').value = product.price;
                    document.getElementById('product-desc').value = product.description;
                    document.getElementById('product-stock').value = product.stock;
                    document.getElementById('product-image').value = product.image;
                    
                    productModal.style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const products = JSON.parse(localStorage.getItem('products'));
                const productName = products.find(p => p.id === parseInt(productId))?.name;
                
                if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
                    const updatedProducts = products.filter(p => p.id !== parseInt(productId));
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                    afficherProduits();
                    updateProductCount();
                    ajouterActivite(`Produit "${productName}" supprimé`);
                }
            });
        });
    }
    
    // Gestion des commandes
    const clearOrdersBtn = document.getElementById('clear-orders');
    const orderSearch = document.getElementById('order-search');
    const searchBtn = document.getElementById('search-btn');
    const exportOrdersBtn = document.getElementById('export-orders');
    
    if (clearOrdersBtn) {
        clearOrdersBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir supprimer toutes les commandes ?')) {
                localStorage.setItem('commandes', JSON.stringify([]));
                afficherCommandes();
                updateStats();
                ajouterActivite('Toutes les commandes ont été supprimées');
            }
        });
    }
    
    if (searchBtn && orderSearch) {
        searchBtn.addEventListener('click', rechercherCommandes);
        orderSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                rechercherCommandes();
            }
        });
    }
    
    if (exportOrdersBtn) {
        exportOrdersBtn.addEventListener('click', function() {
            const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
            if (commandes.length === 0) {
                alert('Aucune commande à exporter.');
                return;
            }
            
            // Créer un CSV
            let csv = 'ID,Client,Téléphone,Adresse,Produit,Prix,Date,Statut\n';
            
            commandes.forEach(cmd => {
                csv += `"${cmd.id}","${cmd.nom}","${cmd.tel}","${cmd.adresse}","${cmd.produit}","${cmd.prix || ''}","${cmd.date}","${cmd.status || 'En attente'}"\n`;
            });
            
            // Créer un lien de téléchargement
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `commandes_mireb_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            ajouterActivite('Export des commandes réalisé');
        });
    }
    
    function rechercherCommandes() {
        if (!orderSearch) return;
        
        const searchTerm = orderSearch.value.toLowerCase();
        const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        
        if (searchTerm === '') {
            afficherCommandes(commandes);
            return;
        }
        
        const filtered = commandes.filter(cmd => {
            return (cmd.id && cmd.id.toLowerCase().includes(searchTerm)) ||
                   cmd.nom.toLowerCase().includes(searchTerm) || 
                   cmd.produit.toLowerCase().includes(searchTerm) || 
                   cmd.adresse.toLowerCase().includes(searchTerm) ||
                   (cmd.status && cmd.status.toLowerCase().includes(searchTerm));
        });
        
        afficherCommandes(filtered);
    }
    
    // Paramètres du site
    const settingsForm = document.getElementById('settings-form');
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const settings = {
                siteTitle: document.getElementById('site-title').value,
                siteDescription: document.getElementById('site-description').value,
                contactEmail: document.getElementById('contact-email').value,
                paymentOnDelivery: document.getElementById('payment-toggle').checked,
                sendOrderEmails: document.getElementById('order-email-toggle').checked
            };
            
            localStorage.setItem('site-settings', JSON.stringify(settings));
            alert('Paramètres enregistrés !');
            ajouterActivite('Paramètres du site mis à jour');
        });
    }
    
    // Sauvegarde et restauration
    const backupBtn = document.getElementById('backup-btn');
    const restoreFile = document.getElementById('restore-file');
    
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            // Créer un objet contenant toutes les données
            const backup = {
                products: JSON.parse(localStorage.getItem('products') || '[]'),
                commandes: JSON.parse(localStorage.getItem('commandes') || '[]'),
                clients: JSON.parse(localStorage.getItem('clients') || '[]'),
                messages: JSON.parse(localStorage.getItem('messages') || '[]'),
                settings: JSON.parse(localStorage.getItem('site-settings') || '{}'),
                activities: JSON.parse(localStorage.getItem('activities') || '[]'),
                timestamp: new Date().toISOString()
            };
            
            // Convertir en JSON et créer un téléchargement
            const jsonStr = JSON.stringify(backup);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.setAttribute('href', url);
            link.setAttribute('download', `mireb_backup_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(link);
            
            link.click();
            document.body.removeChild(link);
            ajouterActivite('Sauvegarde des données téléchargée');
        });
    }
    
    if (restoreFile) {
        restoreFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Vérifier que c'est une sauvegarde valide
                    if (!backup.products || !backup.commandes) {
                        throw new Error('Format de sauvegarde invalide');
                    }
                    
                    // Restaurer les données
                    localStorage.setItem('products', JSON.stringify(backup.products));
                    localStorage.setItem('commandes', JSON.stringify(backup.commandes));
                    localStorage.setItem('clients', JSON.stringify(backup.clients || []));
                    localStorage.setItem('messages', JSON.stringify(backup.messages || []));
                    localStorage.setItem('site-settings', JSON.stringify(backup.settings || {}));
                    localStorage.setItem('activities', JSON.stringify(backup.activities || []));
                    
                    alert('Restauration terminée avec succès !');
                    ajouterActivite('Données restaurées depuis une sauvegarde');
                    
                    // Rafraîchir l'interface
                    initialiserTableauBord();
                } catch (error) {
                    alert('Erreur lors de la restauration : ' + error.message);
                }
            };
            reader.readAsText(file);
        });
    }
    
    // Fonction pour mettre à jour les statistiques
    function updateStats() {
        const orderCountElement = document.getElementById('order-count');
        const clientCountElement = document.getElementById('client-count');
        const productCountElement = document.getElementById('product-count');
        const revenueElement = document.getElementById('revenue');
        
        if (!orderCountElement || !clientCountElement || !productCountElement || !revenueElement) return;
        
        const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Nombre de commandes
        orderCountElement.textContent = commandes.length;
        
        // Nombre de produits
        productCountElement.textContent = products.length;
        
        // Clients uniques
        const clientsUniques = new Set();
        let revenuTotal = 0;
        
        commandes.forEach(cmd => {
            clientsUniques.add(cmd.nom);
            revenuTotal += parseFloat(cmd.prix || 0);
        });
        
        clientCountElement.textContent = clientsUniques.size;
        revenueElement.textContent = revenuTotal.toFixed(2) + ' $';
    }
    
    // Fonction pour initialiser et mettre à jour le tableau de bord
    function initialiserTableauBord() {
        // Mettre à jour les statistiques
        updateStats();
        updateProductCount();
        
        // Charger les commandes, produits, clients, messages
        afficherCommandes();
        afficherProduits();
        afficherClients();
        afficherMessages();
        afficherActivites();
        
        // Mettre à jour les graphiques
        mettreAJourGraphiques();
    }
    
    // Fonction pour afficher les commandes
    function afficherCommandes(commands = null) {
        const ordersTable = document.getElementById('orders-table');
        const noOrdersMessage = document.getElementById('no-orders-message');
        
        if (!ordersTable) return;
        
        const commandes = commands || JSON.parse(localStorage.getItem('commandes') || '[]');
        const tbody = ordersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (commandes.length === 0) {
            if (noOrdersMessage) noOrdersMessage.style.display = 'block';
            return;
        }
        
        if (noOrdersMessage) noOrdersMessage.style.display = 'none';
        
        // Trier par date la plus récente
        commandes.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        commandes.forEach(cmd => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cmd.id || 'N/A'}</td>
                <td>${cmd.nom}</td>
                <td>${cmd.tel}</td>
                <td>${cmd.produit}</td>
                <td>${cmd.prix ? cmd.prix + ' $' : 'N/A'}</td>
                <td>${cmd.date}</td>
                <td>
                    <span class="status-badge status-${(cmd.status || 'En attente').toLowerCase().replace(/\\s+/g, '-')}">${cmd.status || 'En attente'}</span>
                </td>
                <td>
                    <button class="action-btn view-order" title="Voir détails" data-id="${cmd.id || ''}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn change-status" title="Changer status" data-id="${cmd.id || ''}">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="action-btn delete-order" title="Supprimer" data-id="${cmd.id || ''}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Ajouter les événements aux boutons d'action
        configureOrderButtons();
    }
    
    // Configurer les boutons d'action des commandes
    function configureOrderButtons() {
        document.querySelectorAll('.delete-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (!id) return;
                
                if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
                    let commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
                    const commandeASupprimer = commandes.find(c => c.id === id);
                    commandes = commandes.filter(c => c.id !== id);
                    localStorage.setItem('commandes', JSON.stringify(commandes));
                    
                    afficherCommandes();
                    updateStats();
                    ajouterActivite(`Commande ${id} supprimée`);
                }
            });
        });
        
        document.querySelectorAll('.change-status').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (!id) return;
                
                const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
                const index = commandes.findIndex(c => c.id === id);
                
                if (index === -1) return;
                
                const currentStatus = commandes[index].status || 'En attente';
                const statuses = ['En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée'];
                const currentIndex = statuses.indexOf(currentStatus);
                const newStatus = statuses[(currentIndex + 1) % statuses.length];
                
                commandes[index].status = newStatus;
                localStorage.setItem('commandes', JSON.stringify(commandes));
                
                afficherCommandes();
                ajouterActivite(`Commande ${id} : status changé de "${currentStatus}" à "${newStatus}"`);
            });
        });
        
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (!id) return;
                
                const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
                const commande = commandes.find(c => c.id === id);
                
                if (!commande) return;
                
                // Afficher les détails dans une modale ou une alerte
                alert(`
                    Détails de la commande ${id}:
                    
                    Client: ${commande.nom}
                    Téléphone: ${commande.tel}
                    Adresse: ${commande.adresse}
                    Produit: ${commande.produit}
                    Prix: ${commande.prix ? commande.prix + ' $' : 'N/A'}
                    Date: ${commande.date}
                    Status: ${commande.status || 'En attente'}
                `);
            });
        });
    }
    
    // Fonction pour afficher les produits dans l'admin
    function afficherProduits() {
        const adminProducts = document.getElementById('admin-products');
        if (!adminProducts) return;
        
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        adminProducts.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'admin-product-card';
            productCard.innerHTML = `
                <div class="product-card-image">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="product-category-badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                </div>
                <div class="product-card-content">
                    <h4>${product.name}</h4>
                    <p>${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</p>
                    <div class="product-card-info">
                        <span class="price">${product.price.toFixed(2)} $</span>
                        <span class="stock">Stock: ${product.stock}</span>
                    </div>
                    <div class="product-actions">
                        <button class="action-btn edit-product" data-id="${product.id}"><i class="fas fa-edit"></i> Modifier</button>
                        <button class="action-btn delete-product" data-id="${product.id}"><i class="fas fa-trash"></i> Supprimer</button>
                    </div>
                </div>
            `;
            adminProducts.appendChild(productCard);
        });
        
        configurerActionsProduits();
    }
    
    // Fonction pour afficher les clients
    function afficherClients() {
        const clientsTable = document.getElementById('clients-table');
        const noClientsMessage = document.getElementById('no-clients-message');
        
        if (!clientsTable) return;
        
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const tbody = clientsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (clients.length === 0) {
            if (noClientsMessage) noClientsMessage.style.display = 'block';
            return;
        }
        
        if (noClientsMessage) noClientsMessage.style.display = 'none';
        
        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${client.nom}</td>
                <td>${client.email || 'N/A'}</td>
                <td>${client.tel}</td>
                <td>${client.commandes ? client.commandes.length : 0}</td>
                <td>${client.valeurTotale ? client.valeurTotale.toFixed(2) + ' $' : '0,00 $'}</td>
                <td>
                    <button class="action-btn view-client" title="Voir détails" data-id="${client.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete-client" title="Supprimer" data-id="${client.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    // Fonction pour afficher les messages
    function afficherMessages() {
        const messagesContainer = document.getElementById('admin-messages');
        const noMessagesElement = document.getElementById('no-messages');
        
        if (!messagesContainer) return;
        
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            if (noMessagesElement) noMessagesElement.style.display = 'block';
            return;
        }
        
        if (noMessagesElement) noMessagesElement.style.display = 'none';
        
        // Trier par date décroissante
        messages.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        messages.forEach(msg => {
            const messageCard = document.createElement('div');
            messageCard.className = `message-card${msg.read ? ' message-read' : ''}`;
            messageCard.setAttribute('data-id', msg.id);
            
            messageCard.innerHTML = `
                <div class="message-header">
                    <div class="message-info">
                        <span class="message-from">${msg.name}</span>
                        <span class="message-email">${msg.email}</span>
                    </div>
                    <span class="message-date">${msg.date}</span>
                </div>
                <h4 class="message-subject">${msg.subject || 'Contact général'}</h4>
                <div class="message-content">${msg.message}</div>
                <div class="message-actions">
                    <button class="mark-read" title="${msg.read ? 'Marquer comme non-lu' : 'Marquer comme lu'}">
                        <i class="fas ${msg.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                    </button>
                    <button class="delete-message" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            messagesContainer.appendChild(messageCard);
        });
        
        // Configurer les boutons d'action des messages
        document.querySelectorAll('.mark-read').forEach(btn => {
            btn.addEventListener('click', function() {
                const messageCard = this.closest('.message-card');
                const id = parseInt(messageCard.getAttribute('data-id'));
                const messages = JSON.parse(localStorage.getItem('messages') || '[]');
                const index = messages.findIndex(m => m.id === id);
                
                if (index !== -1) {
                    messages[index].read = !messages[index].read;
                    localStorage.setItem('messages', JSON.stringify(messages));
                    
                    // Mettre à jour l'affichage
                    messageCard.classList.toggle('message-read');
                    this.innerHTML = `<i class="fas ${messages[index].read ? 'fa-envelope' : 'fa-envelope-open'}"></i>`;
                    this.setAttribute('title', messages[index].read ? 'Marquer comme non-lu' : 'Marquer comme lu');
                }
            });
        });
        
        document.querySelectorAll('.delete-message').forEach(btn => {
            btn.addEventListener('click', function() {
                const messageCard = this.closest('.message-card');
                const id = parseInt(messageCard.getAttribute('data-id'));
                
                if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
                    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
                    const updatedMessages = messages.filter(m => m.id !== id);
                    localStorage.setItem('messages', JSON.stringify(updatedMessages));
                    
                    // Supprimer la carte du message
                    messageCard.remove();
                    
                    // Afficher "pas de messages" si nécessaire
                    if (updatedMessages.length === 0 && noMessagesElement) {
                        noMessagesElement.style.display = 'block';
                    }
                    
                    ajouterActivite('Message supprimé');
                }
            });
        });
    }
    
    // Gestion des activités
    function ajouterActivite(description) {
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        
        activities.unshift({
            id: Date.now(),
            description,
            date: new Date().toLocaleString()
        });
        
        // Limiter à 50 activités
        if (activities.length > 50) {
            activities.pop();
        }
        
        localStorage.setItem('activities', JSON.stringify(activities));
        afficherActivites();
    }
    
    function afficherActivites() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        activityList.innerHTML = '';
        
        if (activities.length === 0) {
            activityList.innerHTML = '<li class="no-activity">Aucune activité récente</li>';
            return;
        }
        
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.className = 'activity-item';
            li.innerHTML = `
                <span class="activity-time">${activity.date}</span>
                <span class="activity-desc">${activity.description}</span>
            `;
            activityList.appendChild(li);
        });
    }
    
    // Mise à jour du nombre de produits
    function updateProductCount() {
        const productCount = document.getElementById('product-count');
        if (!productCount) return;
        
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        productCount.textContent = products.length;
    }
    
    // Initialisation et mise à jour des graphiques
    function mettreAJourGraphiques() {
        const ordersChartCanvas = document.getElementById('orders-chart');
        const productsChartCanvas = document.getElementById('products-chart');
        
        if (!ordersChartCanvas || !productsChartCanvas) return;
        
        // Nettoyer les graphiques existants
        if (ordersChart) ordersChart.destroy();
        if (productsChart) productsChart.destroy();
        
        // Données pour le graphique des commandes
        const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        const derniers7Jours = Array(7).fill().map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        });
        
        const commandesParJour = derniers7Jours.map(jour => {
            return commandes.filter(cmd => {
                const dateCommande = new Date(cmd.date.split(',')[0]);
                return dateCommande.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === jour;
            }).length;
        });
        
        // Données pour le graphique des produits
        const produits = JSON.parse(localStorage.getItem('products') || '[]');
        const produitsCommandes = commandes.reduce((acc, cmd) => {
            if (cmd.produit) {
                acc[cmd.produit] = (acc[cmd.produit] || 0) + 1;
            }
            return acc;
        }, {});
        
        const topProduits = Object.entries(produitsCommandes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        // Créer le graphique des commandes
        ordersChart = new Chart(ordersChartCanvas, {
            type: 'line',
            data: {
                labels: derniers7Jours,
                datasets: [{
                    label: 'Commandes par jour',
                    data: commandesParJour,
                    backgroundColor: 'rgba(63, 81, 181, 0.2)',
                    borderColor: 'rgba(63, 81, 181, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(63, 81, 181, 1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
        });
        
        // Créer le graphique des produits
        productsChart = new Chart(productsChartCanvas, {
            type: 'doughnut',
            data: {
                labels: topProduits.map(p => p[0]),
                datasets: [{
                    data: topProduits.map(p => p[1]),
                    backgroundColor: [
                        'rgba(63, 81, 181, 0.8)',
                        'rgba(92, 107, 192, 0.8)',
                        'rgba(121, 134, 203, 0.8)',
                        'rgba(159, 168, 218, 0.8)',
                        'rgba(197, 202, 233, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Ajout de Chart.js si on est sur la page admin
    if (document.getElementById('admin-panel')) {
        // Vérifie si Chart.js est déjà chargé
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = function() {
                // Initialiser les graphiques une fois Chart.js chargé
                initialiserTableauBord();
            };
            document.head.appendChild(script);
        } else {
            initialiserTableauBord();
        }
    }
});
