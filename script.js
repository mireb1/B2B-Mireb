// Petite interaction pour le formulaire de contact et le bouton d'achat

document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('form-message');
            formMessage.textContent = 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.';
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
            if (produitCommande) produitCommande.value = btn.getAttribute('data-produit');
            if (orderModal) orderModal.style.display = 'flex';
            if (orderMessage) orderMessage.textContent = '';
        });
    });

    if (closeModal) {
        closeModal.onclick = () => orderModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === orderModal) orderModal.style.display = 'none';
    };

    if (orderForm) {
        orderForm.onsubmit = function(e) {
            e.preventDefault();
            const nom = orderForm.nom.value;
            const tel = orderForm.tel.value;
            const adresse = orderForm.adresse.value;
            const produit = produitCommande.value;
            const date = new Date().toLocaleString();
            
            // Stockage local
            let commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
            commandes.push({ nom, tel, adresse, produit, date, id: Date.now() });
            localStorage.setItem('commandes', JSON.stringify(commandes));
            
            orderMessage.innerHTML = '<i class="fas fa-check-circle"></i> Commande enregistrée ! Paiement à la réception.';
            orderMessage.style.color = '#4CAF50';
            orderForm.reset();
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
    const ordersTable = document.getElementById('orders-table');
    const logoutBtn = document.getElementById('logout-btn');
    const noOrdersMessage = document.getElementById('no-orders-message');
    const orderCount = document.getElementById('order-count');
    const clientCount = document.getElementById('client-count');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const clearOrdersBtn = document.getElementById('clear-orders');
    const orderSearch = document.getElementById('order-search');
    const searchBtn = document.getElementById('search-btn');
    const settingsForm = document.getElementById('settings-form');
    
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const pass = document.getElementById('admin-pass').value;
            if (pass === 'admin2025') {
                adminLogin.style.display = 'none';
                adminPanel.style.display = 'block';
                afficherCommandes();
                updateStats();
            } else {
                loginMessage.textContent = 'Mot de passe incorrect.';
                loginMessage.style.color = 'red';
            }
        };
    }
    
    // Gestion des onglets
    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tab = btn.getAttribute('data-tab');
                document.getElementById(`${tab}-tab`).classList.add('active');
            });
        });
    }
    
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            adminPanel.style.display = 'none';
            adminLogin.style.display = 'block';
            document.getElementById('admin-pass').value = '';
        };
    }
    
    // Supprimer toutes les commandes
    if (clearOrdersBtn) {
        clearOrdersBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir supprimer toutes les commandes ?')) {
                localStorage.removeItem('commandes');
                afficherCommandes();
                updateStats();
            }
        });
    }
    
    // Recherche de commandes
    if (searchBtn && orderSearch) {
        searchBtn.addEventListener('click', function() {
            rechercherCommandes();
        });
        
        orderSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                rechercherCommandes();
            }
        });
    }
    
    function rechercherCommandes() {
        const searchTerm = orderSearch.value.toLowerCase();
        const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        
        if (searchTerm === '') {
            afficherCommandes(commandes);
            return;
        }
        
        const filtered = commandes.filter(cmd => {
            return cmd.nom.toLowerCase().includes(searchTerm) || 
                   cmd.produit.toLowerCase().includes(searchTerm) || 
                   cmd.adresse.toLowerCase().includes(searchTerm);
        });
        
        afficherCommandes(filtered);
    }
    
    // Enregistrement des paramètres
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Paramètres enregistrés !');
        });
    }
    
    function supprimerCommande(id) {
        let commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        commandes = commandes.filter(cmd => cmd.id != id);
        localStorage.setItem('commandes', JSON.stringify(commandes));
        afficherCommandes();
        updateStats();
    }
    
    function afficherCommandes(commands = null) {
        const commandes = commands || JSON.parse(localStorage.getItem('commandes') || '[]');
        if (!ordersTable) return;
        
        const tbody = ordersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (commandes.length === 0) {
            if (noOrdersMessage) noOrdersMessage.style.display = 'block';
            return;
        }
        
        if (noOrdersMessage) noOrdersMessage.style.display = 'none';
        
        commandes.forEach(cmd => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cmd.nom}</td>
                <td>${cmd.tel}</td>
                <td>${cmd.adresse}</td>
                <td>${cmd.produit}</td>
                <td>${cmd.date}</td>
                <td>
                    <button class="action-btn view-btn" title="Voir détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${cmd.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Ajouter les event listeners pour les boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
                    supprimerCommande(id);
                }
            });
        });
    }
    
    function updateStats() {
        if (!orderCount || !clientCount) return;
        
        const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        orderCount.textContent = commandes.length;
        
        // Compter les clients uniques
        const clients = new Set();
        commandes.forEach(cmd => clients.add(cmd.nom));
        clientCount.textContent = clients.size;
    }
});
