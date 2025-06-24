// Petite interaction pour le formulaire de contact et le bouton d'achat

document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de contact
    const form = document.getElementById('contact-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('form-message').textContent = 'Merci pour votre message !';
            form.reset();
        });
    }
    // Boutons d'achat
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Merci pour votre intérêt ! Un commercial vous contactera.');
        });
    });

    // Gestion de la modale de commande et stockage des commandes

    // Modale commande
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
    if (closeModal) closeModal.onclick = () => orderModal.style.display = 'none';
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
            commandes.push({ nom, tel, adresse, produit, date });
            localStorage.setItem('commandes', JSON.stringify(commandes));
            orderMessage.textContent = 'Commande enregistrée ! Paiement à la réception.';
            orderForm.reset();
            setTimeout(() => { orderModal.style.display = 'none'; }, 1500);
        };
    }

    // Admin login
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const adminLogin = document.getElementById('admin-login');
    const loginMessage = document.getElementById('login-message');
    const ordersTable = document.getElementById('orders-table');
    const logoutBtn = document.getElementById('logout-btn');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const pass = document.getElementById('admin-pass').value;
            if (pass === 'admin2025') {
                adminLogin.style.display = 'none';
                adminPanel.style.display = 'block';
                afficherCommandes();
            } else {
                loginMessage.textContent = 'Mot de passe incorrect.';
            }
        };
    }
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            adminPanel.style.display = 'none';
            adminLogin.style.display = 'block';
        };
    }
    function afficherCommandes() {
        const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
        const tbody = ordersTable.querySelector('tbody');
        tbody.innerHTML = '';
        commandes.forEach(cmd => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${cmd.nom}</td><td>${cmd.tel}</td><td>${cmd.adresse}</td><td>${cmd.produit}</td><td>${cmd.date}</td>`;
            tbody.appendChild(tr);
        });
    }
});
