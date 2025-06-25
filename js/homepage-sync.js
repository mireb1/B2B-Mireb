// Synchronisation dynamique de la page d'accueil avec l'admin
// Style Shopify - Mise à jour automatique des catégories et produits

class HomepageSync {
    constructor() {
        this.searchInput = null;
        this.currencySelect = null;
        this.exchangeRates = {
            EUR: 1,
            USD: 1.1
        };
        this.currentCurrency = 'EUR';
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadInitialData();
        console.log('🏠 Synchronisation de la page d\'accueil initialisée');
    }

    setupElements() {
        // Références aux éléments DOM
        this.searchInput = document.querySelector('.search-bar input');
        this.currencySelect = document.getElementById('currencySelect');
        this.categoriesTop = document.getElementById('categories-top-grid');
        this.categoriesBottom = document.getElementById('categories-bottom-grid');
        this.featuredProductsGrid = document.getElementById('featured-products-grid');
        this.regularProductsGrid = document.getElementById('regular-products-grid');
    }

    setupEventListeners() {
        // Écouter les mises à jour des données depuis l'admin
        window.addEventListener('mirebDataUpdated', (e) => {
            console.log('📥 Données mises à jour depuis l\'admin:', e.detail);
            this.updateDisplay(e.detail);
            this.showUpdateNotification();
        });

        // Écouter les changements dans localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'mireb_categories' || e.key === 'mireb_products') {
                this.handleStorageChange(e);
            }
        });

        // Recherche en temps réel
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Changement de devise
        if (this.currencySelect) {
            this.currencySelect.addEventListener('change', (e) => {
                this.changeCurrency(e.target.value);
            });
        }

        // Vérification périodique des mises à jour
        setInterval(() => {
            this.checkForUpdates();
        }, 3000);
    }

    // Charger les données initiales
    loadInitialData() {
        try {
            const categories = JSON.parse(localStorage.getItem('mireb_categories') || '[]');
            const products = JSON.parse(localStorage.getItem('mireb_products') || '[]');
            
            if (categories.length > 0 || products.length > 0) {
                this.updateDisplay({
                    categories,
                    products,
                    featuredProducts: products.filter(p => p.featured),
                    regularProducts: products.filter(p => !p.featured)
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des données initiales:', error);
        }
    }

    // Mettre à jour l'affichage complet
    updateDisplay(data) {
        try {
            if (data.categories) {
                this.updateCategories(data.categories);
            }
            if (data.featuredProducts) {
                this.updateFeaturedProducts(data.featuredProducts);
            }
            if (data.regularProducts) {
                this.updateRegularProducts(data.regularProducts);
            }
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour de l\'affichage:', error);
        }
    }

    // Mettre à jour les catégories
    updateCategories(categories) {
        try {
            const topCategories = categories.filter(c => c.position === 'top');
            const bottomCategories = categories.filter(c => c.position === 'bottom');

            // Mettre à jour les catégories du haut
            if (this.categoriesTop) {
                this.categoriesTop.innerHTML = topCategories.map(category => `
                    <div class="category-item" onclick="filterByCategory(${category.id})">
                        <div class="category-icon" style="background-color: ${category.color}">
                            <i class="${category.icon}"></i>
                        </div>
                        <span>${category.name}</span>
                    </div>
                `).join('');
            }

            // Mettre à jour les catégories du bas
            if (this.categoriesBottom) {
                this.categoriesBottom.innerHTML = bottomCategories.map(category => `
                    <div class="category-item" onclick="filterByCategory(${category.id})">
                        <div class="category-icon" style="background-color: ${category.color}">
                            <i class="${category.icon}"></i>
                        </div>
                        <span>${category.name}</span>
                    </div>
                `).join('');
            }

            console.log('🏷️ Catégories mises à jour:', {
                top: topCategories.length,
                bottom: bottomCategories.length
            });
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour des catégories:', error);
        }
    }

    // Mettre à jour les produits vedettes
    updateFeaturedProducts(products) {
        try {
            if (this.featuredProductsGrid) {
                this.featuredProductsGrid.innerHTML = products.map(product => `
                    <div class="product-card" onclick="openOrderForm('${product.name}', ${product.price})">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <div class="product-price" data-price="${product.price}">
                                ${this.formatPrice(product.price)}
                            </div>
                            <button class="order-btn">Commander</button>
                        </div>
                    </div>
                `).join('');
            }

            console.log('⭐ Produits vedettes mis à jour:', products.length);
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour des produits vedettes:', error);
        }
    }

    // Mettre à jour les produits réguliers
    updateRegularProducts(products) {
        try {
            if (this.regularProductsGrid) {
                this.regularProductsGrid.innerHTML = products.map(product => `
                    <div class="product-card" onclick="openOrderForm('${product.name}', ${product.price})">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <div class="product-price" data-price="${product.price}">
                                ${this.formatPrice(product.price)}
                            </div>
                            <button class="order-btn">Commander</button>
                        </div>
                    </div>
                `).join('');
            }

            console.log('📦 Produits réguliers mis à jour:', products.length);
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour des produits réguliers:', error);
        }
    }

    // Gérer la recherche
    handleSearch(query) {
        try {
            if (!query.trim()) {
                this.loadInitialData();
                return;
            }

            const products = JSON.parse(localStorage.getItem('mireb_products') || '[]');
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );

            this.updateFeaturedProducts(filteredProducts.filter(p => p.featured));
            this.updateRegularProducts(filteredProducts.filter(p => !p.featured));

            console.log('🔍 Recherche effectuée:', query, 'Résultats:', filteredProducts.length);
        } catch (error) {
            console.error('❌ Erreur lors de la recherche:', error);
        }
    }

    // Changer la devise
    changeCurrency(currency) {
        try {
            this.currentCurrency = currency;
            
            // Mettre à jour tous les prix affichés
            const priceElements = document.querySelectorAll('.product-price');
            priceElements.forEach(element => {
                const price = parseFloat(element.getAttribute('data-price'));
                element.textContent = this.formatPrice(price);
            });

            // Déclencher un événement pour notifier le changement
            window.dispatchEvent(new CustomEvent('currencyChanged', {
                detail: {
                    currency: currency,
                    rate: this.exchangeRates[currency]
                }
            }));

            console.log('💱 Devise changée:', currency);
        } catch (error) {
            console.error('❌ Erreur lors du changement de devise:', error);
        }
    }

    // Formater le prix selon la devise
    formatPrice(price) {
        try {
            const convertedPrice = price * this.exchangeRates[this.currentCurrency];
            const symbol = this.currentCurrency === 'EUR' ? '€' : '$';
            return `${convertedPrice.toFixed(2)}${symbol}`;
        } catch (error) {
            console.error('❌ Erreur lors du formatage du prix:', error);
            return `${price}€`;
        }
    }

    // Filtrer par catégorie
    filterByCategory(categoryId) {
        try {
            const products = JSON.parse(localStorage.getItem('mireb_products') || '[]');
            const filteredProducts = products.filter(product => product.category === categoryId);

            this.updateFeaturedProducts(filteredProducts.filter(p => p.featured));
            this.updateRegularProducts(filteredProducts.filter(p => !p.featured));

            console.log('🏷️ Filtrage par catégorie:', categoryId, 'Résultats:', filteredProducts.length);
        } catch (error) {
            console.error('❌ Erreur lors du filtrage par catégorie:', error);
        }
    }

    // Gérer les changements de localStorage
    handleStorageChange(e) {
        try {
            if (e.newValue) {
                const data = JSON.parse(e.newValue);
                if (e.key === 'mireb_categories') {
                    this.updateCategories(data);
                } else if (e.key === 'mireb_products') {
                    this.updateFeaturedProducts(data.filter(p => p.featured));
                    this.updateRegularProducts(data.filter(p => !p.featured));
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors du traitement du changement de localStorage:', error);
        }
    }

    // Vérifier les mises à jour
    checkForUpdates() {
        try {
            const lastUpdate = localStorage.getItem('mireb_last_update');
            const currentTime = Date.now().toString();
            
            if (lastUpdate !== currentTime) {
                this.loadInitialData();
                localStorage.setItem('mireb_last_update', currentTime);
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification des mises à jour:', error);
        }
    }

    // Afficher une notification de mise à jour
    showUpdateNotification() {
        try {
            const notification = document.createElement('div');
            notification.className = 'sync-notification';
            notification.innerHTML = `
                <div class="sync-notification-content">
                    <i class="fas fa-sync-alt spinning"></i>
                    <span>Données mises à jour !</span>
                    <button onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        } catch (error) {
            console.error('❌ Erreur lors de l\'affichage de la notification:', error);
        }
    }
}

// Fonctions globales pour l'interaction
window.filterByCategory = function(categoryId) {
    if (window.homepageSync) {
        window.homepageSync.filterByCategory(categoryId);
    }
};

window.changeCurrency = function() {
    const select = document.getElementById('currencySelect');
    if (select && window.homepageSync) {
        window.homepageSync.changeCurrency(select.value);
    }
};

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    window.homepageSync = new HomepageSync();
});
