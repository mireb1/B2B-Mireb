// Gestion dynamique des catégories sur la page d'accueil
// Synchronisation avec l'admin et affichage moderne

class HomepageCategories {
    constructor() {
        // Variables de configuration principale
        this.config = {
            itemsPerPage: 12,
            animationDelay: 100,
            refreshInterval: 30000, // 30 secondes
            maxRetries: 3,
            apiTimeout: 5000
        };
        
        // Variables d'état
        this.state = {
            categories: [],
            productsData: [],
            currentLayout: 'grid', // grid, list, carousel
            currentPage: 1,
            isLoading: false,
            lastUpdate: null,
            filters: {
                sortBy: 'name',
                searchQuery: '',
                activeOnly: true
            }
        };
        
        // Cache et performance
        this.cache = {
            categoryViews: new Map(),
            productViews: new Map(),
            renderCache: new Map(),
            lastRenderTime: 0
        };
        
        // Références DOM
        this.elements = {
            categoriesContainer: null,
            featuredContainer: null,
            layoutBtns: null,
            sortSelect: null
        };
        
        this.init();
    }

    // Initialiser le gestionnaire
    init() {
        try {
            // Charger les données
            this.loadData();
            
            // Initialiser l'interface
            this.initializeInterface();
            
            // Écouter les changements depuis l'admin
            this.setupEventListeners();
            this.setupAdminSync();
            
            // Démarrer le rafraîchissement automatique
            this.startAutoRefresh();
            
            console.log('🏠 Gestionnaire des catégories d\'accueil initialisé', {
                categories: this.state.categories.length,
                products: this.state.productsData.length,
                layout: this.state.currentLayout
            });
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.handleError(error);
        }
    }

    // Charger toutes les données
    async loadData() {
        this.state.isLoading = true;
        
        try {
            await Promise.all([
                this.loadCategories(),
                this.loadProducts(),
                this.loadViewStats()
            ]);
            
            this.associateProductsWithCategories();
            this.state.lastUpdate = new Date();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            throw error;
        } finally {
            this.state.isLoading = false;
        }
    }

    // Charger les catégories depuis la configuration
    async loadCategories() {
        try {
            // Utiliser les catégories de l'admin si disponibles
            if (window.categoriesConfig) {
                this.state.categories = window.categoriesConfig.getActiveCategories();
            } else {
                // Essayer de charger depuis l'API ou localStorage
                const savedCategories = localStorage.getItem('mireb_categories');
                
                if (savedCategories) {
                    this.state.categories = JSON.parse(savedCategories);
                } else {
                    // Catégories par défaut optimisées
                    this.state.categories = this.getDefaultCategories();
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            this.state.categories = this.getDefaultCategories();
        }
    }

    // Charger les produits
    async loadProducts() {
        try {
            const savedProducts = localStorage.getItem('mireb_products');
            
            if (savedProducts) {
                this.state.productsData = JSON.parse(savedProducts);
            } else {
                // Produits d'exemple optimisés
                this.state.productsData = this.getDefaultProducts();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            this.state.productsData = this.getDefaultProducts();
        }
    }

    // Associer les produits aux catégories
    associateProductsWithCategories() {
        this.state.categories.forEach(category => {
            category.products = this.state.productsData.filter(product => product.category === category.id);
        });
    }

    // Initialiser l'interface
    initializeInterface() {
        // Vérifier si on est sur la page d'accueil
        if (!this.isHomePage()) return;

        // Créer la section des catégories
        this.createCategoriesSection();
        
        // Créer la section des produits populaires
        this.createFeaturedProductsSection();
        
        // Initialiser les événements
        this.initializeEvents();
        
        // Afficher les catégories
        this.renderCategories();
        
        // Afficher les produits populaires
        this.renderFeaturedProducts();
    }

    // Vérifier si on est sur la page d'accueil
    isHomePage() {
        return window.location.pathname === '/' || 
               window.location.pathname === '/index.html' || 
               window.location.pathname.endsWith('index.html');
    }

    // Créer la section des catégories
    createCategoriesSection() {
        const existingSection = document.getElementById('categories-section');
        if (existingSection) return;

        const categoriesHTML = `
            <section id="categories-section" class="categories-showcase">
                <div class="container">
                    <div class="section-header">
                        <h2><i class="fas fa-th-large"></i> Nos Catégories</h2>
                        <p>Découvrez notre large gamme de produits</p>
                    </div>
                    
                    <div class="categories-controls">
                        <div class="layout-switcher">
                            <button class="layout-btn active" data-layout="grid">
                                <i class="fas fa-th"></i>
                            </button>
                            <button class="layout-btn" data-layout="list">
                                <i class="fas fa-list"></i>
                            </button>
                            <button class="layout-btn" data-layout="carousel">
                                <i class="fas fa-images"></i>
                            </button>
                        </div>
                        
                        <div class="category-filters">
                            <select id="category-sort">
                                <option value="name">Trier par nom</option>
                                <option value="products">Trier par nombre de produits</option>
                                <option value="popularity">Trier par popularité</option>
                            </select>
                        </div>
                    </div>
                    
                    <div id="categories-container" class="categories-grid">
                        <!-- Les catégories seront insérées ici -->
                    </div>
                </div>
            </section>
        `;

        // Insérer après le header ou au début du main
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterbegin', categoriesHTML);
        }
    }

    // Créer la section des produits populaires
    createFeaturedProductsSection() {
        const existingSection = document.getElementById('featured-products-section');
        if (existingSection) return;

        const featuredHTML = `
            <section id="featured-products-section" class="featured-products">
                <div class="container">
                    <div class="section-header">
                        <h2><i class="fas fa-star"></i> Produits Populaires</h2>
                        <p>Nos meilleures ventes du moment</p>
                    </div>
                    
                    <div id="featured-products-container" class="products-grid">
                        <!-- Les produits populaires seront insérées ici -->
                    </div>
                    
                    <div class="section-footer">
                        <a href="produits.html" class="cta-button">
                            <i class="fas fa-shopping-bag"></i>
                            Voir tous les produits
                        </a>
                    </div>
                </div>
            </section>
        `;

        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
            categoriesSection.insertAdjacentHTML('afterend', featuredHTML);
        }
    }

    // Initialiser les événements
    initializeEvents() {
        // Changement de layout
        document.addEventListener('click', (e) => {
            if (e.target.closest('.layout-btn')) {
                const btn = e.target.closest('.layout-btn');
                this.changeLayout(btn.dataset.layout);
            }
        });

        // Tri des catégories
        const sortSelect = document.getElementById('category-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortCategories(e.target.value);
            });
        }

        // Clic sur une catégorie
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-card')) {
                const card = e.target.closest('.category-card');
                const categoryId = parseInt(card.dataset.categoryId);
                this.navigateToCategory(categoryId);
            }
        });

        // Clic sur un produit
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                const productId = parseInt(card.dataset.productId);
                this.navigateToProduct(productId);
            }
        });
    }

    // Afficher les catégories
    renderCategories() {
        const container = document.getElementById('categories-container');
        if (!container) return;

        const categoriesHTML = this.state.categories.map(category => {
            const productCount = category.products.length;
            
            return `
                <div class="category-card" data-category-id="${category.id}">
                    <div class="category-image" style="background: ${category.gradient}">
                        <i class="${category.icon}"></i>
                        ${category.image ? `<img src="${category.image}" alt="${category.name}" />` : ''}
                    </div>
                    
                    <div class="category-content">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                        <div class="category-stats">
                            <span class="product-count">
                                <i class="fas fa-box"></i>
                                ${productCount} produit${productCount > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    
                    <div class="category-actions">
                        <button class="btn-primary">
                            <i class="fas fa-arrow-right"></i>
                            Découvrir
                        </button>
                    </div>
                    
                    <div class="category-overlay">
                        <button class="btn-secondary">
                            <i class="fas fa-eye"></i>
                            Aperçu
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = categoriesHTML;
        
        // Animer l'apparition
        this.animateCategories();
    }

    // Afficher les produits populaires
    renderFeaturedProducts() {
        const container = document.getElementById('featured-products-container');
        if (!container) return;

        const featuredProducts = this.state.productsData.filter(product => product.featured);
        
        const productsHTML = featuredProducts.map(product => {
            const category = this.state.categories.find(cat => cat.id === product.category);
            
            return `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" />
                        <div class="product-badge">
                            <i class="fas fa-star"></i>
                            Populaire
                        </div>
                        ${product.stock < 5 ? '<div class="stock-badge">Stock limité</div>' : ''}
                    </div>
                    
                    <div class="product-content">
                        <div class="product-category" style="color: ${category?.color || '#667eea'}">
                            <i class="${category?.icon || 'fas fa-tag'}"></i>
                            ${category?.name || 'Général'}
                        </div>
                        
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        
                        <div class="product-price">
                            <span class="current-price">${product.price.toFixed(2)} €</span>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn-primary add-to-cart" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                                Ajouter au panier
                            </button>
                            <button class="btn-secondary view-details">
                                <i class="fas fa-eye"></i>
                                Détails
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = productsHTML;
        
        // Animer l'apparition
        this.animateProducts();
    }

    // Changer le layout d'affichage
    changeLayout(layout) {
        this.state.currentLayout = layout;
        
        // Mettre à jour les boutons
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-layout="${layout}"]`).classList.add('active');
        
        // Mettre à jour le container
        const container = document.getElementById('categories-container');
        if (container) {
            container.className = `categories-${layout}`;
            
            // Re-render avec le nouveau layout
            this.renderCategories();
        }
    }

    // Trier les catégories
    sortCategories(sortBy) {
        switch (sortBy) {
            case 'name':
                this.state.categories.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'products':
                this.state.categories.sort((a, b) => b.products.length - a.products.length);
                break;
            case 'popularity':
                // Tri par popularité basé sur le nombre de vues/commandes
                this.state.categories.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
            default:
                // Tri par ordre défini dans l'admin
                this.state.categories.sort((a, b) => a.order - b.order);
        }
        
        this.renderCategories();
    }

    // Naviguer vers une catégorie
    navigateToCategory(categoryId) {
        const category = this.state.categories.find(cat => cat.id === categoryId);
        if (category) {
            // Enregistrer la vue de catégorie
            this.recordCategoryView(categoryId);
            
            // Naviguer vers la page produits avec filtre catégorie
            window.location.href = `produits.html?category=${categoryId}`;
        }
    }

    // Naviguer vers un produit
    navigateToProduct(productId) {
        const product = this.state.productsData.find(prod => prod.id === productId);
        if (product) {
            // Enregistrer la vue de produit
            this.recordProductView(productId);
            
            // Naviguer vers la page de détail du produit
            window.location.href = `product-detail.html?id=${productId}`;
        }
    }

    // Enregistrer une vue de catégorie
    recordCategoryView(categoryId) {
        try {
            const views = JSON.parse(localStorage.getItem('category_views') || '{}');
            views[categoryId] = (views[categoryId] || 0) + 1;
            localStorage.setItem('category_views', JSON.stringify(views));
            
            // Mettre à jour la catégorie
            const category = this.state.categories.find(cat => cat.id === categoryId);
            if (category) {
                category.views = views[categoryId];
            }
        } catch (error) {
            console.error('Erreur enregistrement vue catégorie:', error);
        }
    }

    // Enregistrer une vue de produit
    recordProductView(productId) {
        try {
            const views = JSON.parse(localStorage.getItem('product_views') || '{}');
            views[productId] = (views[productId] || 0) + 1;
            localStorage.setItem('product_views', JSON.stringify(views));
        } catch (error) {
            console.error('Erreur enregistrement vue produit:', error);
        }
    }

    // Animer l'apparition des catégories
    animateCategories() {
        const cards = document.querySelectorAll('.category-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    // Animer l'apparition des produits
    animateProducts() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                card.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            }, index * 150);
        });
    }

    // Charger les statistiques des vues
    async loadViewStats() {
        try {
            const categoryViews = JSON.parse(localStorage.getItem('category_views') || '{}');
            const productViews = JSON.parse(localStorage.getItem('product_views') || '{}');
            
            this.cache.categoryViews = new Map(Object.entries(categoryViews));
            this.cache.productViews = new Map(Object.entries(productViews));
        } catch (error) {
            console.error('Erreur lors du chargement des stats:', error);
        }
    }

    // Configurer les listeners d'événements
    setupEventListeners() {
        this.listenForUpdates();
        this.initializeEvents();
        this.setupAdminSync();
    }

    // Écouter les mises à jour depuis l'admin
    listenForUpdates() {
        // Écouter les changements dans le localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'mireb_categories' || e.key === 'mireb_products') {
                this.loadData();
                this.renderCategories();
                this.renderFeaturedProducts();
            }
        });

        // Écouter les événements personnalisés
        window.addEventListener('categoriesUpdated', () => {
            this.loadCategories();
            this.renderCategories();
        });

        window.addEventListener('productsUpdated', () => {
            this.loadProducts();
            this.renderFeaturedProducts();
        });
    }

    // Améliorer la synchronisation avec l'admin
    setupAdminSync() {
        // Écouter les événements personnalisés de l'admin
        window.addEventListener('adminDataUpdated', (e) => {
            console.log('📥 Données mises à jour depuis l\'admin', e.detail);
            
            // Mettre à jour les données locales
            if (e.detail.categories) {
                this.state.categories = e.detail.categories;
            }
            if (e.detail.products) {
                this.state.productsData = e.detail.products;
            }
            
            // Associer les produits avec les catégories
            this.associateProductsWithCategories();
            
            // Re-rendre l'interface
            this.renderCategories();
            this.renderFeaturedProducts();
            
            // Mettre à jour le timestamp
            this.state.lastUpdate = new Date(e.detail.timestamp);
            
            // Notifier l'utilisateur si visible
            if (document.visibilityState === 'visible') {
                this.showUpdateNotification();
            }
        });
        
        // Écouter les changements dans le localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'mireb_categories' || e.key === 'mireb_products') {
                console.log('📱 Changement détecté dans le localStorage:', e.key);
                this.handleStorageChange(e);
            }
        });
        
        // Vérifier les mises à jour périodiquement
        setInterval(() => {
            this.checkForUpdates();
        }, 5000); // Vérifier toutes les 5 secondes
    }
    
    // Gérer les changements du localStorage
    handleStorageChange(e) {
        try {
            if (e.key === 'mireb_categories' && e.newValue) {
                const newCategories = JSON.parse(e.newValue);
                if (JSON.stringify(newCategories) !== JSON.stringify(this.state.categories)) {
                    this.state.categories = newCategories;
                    this.renderCategories();
                    console.log('🔄 Catégories mises à jour depuis le localStorage');
                }
            }
            
            if (e.key === 'mireb_products' && e.newValue) {
                const newProducts = JSON.parse(e.newValue);
                if (JSON.stringify(newProducts) !== JSON.stringify(this.state.productsData)) {
                    this.state.productsData = newProducts;
                    this.associateProductsWithCategories();
                    this.renderFeaturedProducts();
                    console.log('🔄 Produits mis à jour depuis le localStorage');
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors du traitement du changement de localStorage:', error);
        }
    }
    
    // Vérifier les mises à jour
    checkForUpdates() {
        try {
            // Vérifier les catégories
            const savedCategories = localStorage.getItem('mireb_categories');
            if (savedCategories) {
                const categories = JSON.parse(savedCategories);
                if (JSON.stringify(categories) !== JSON.stringify(this.state.categories)) {
                    this.state.categories = categories;
                    this.renderCategories();
                    console.log('🔄 Catégories synchronisées automatiquement');
                }
            }
            
            // Vérifier les produits
            const savedProducts = localStorage.getItem('mireb_products');
            if (savedProducts) {
                const products = JSON.parse(savedProducts);
                if (JSON.stringify(products) !== JSON.stringify(this.state.productsData)) {
                    this.state.productsData = products;
                    this.associateProductsWithCategories();
                    this.renderFeaturedProducts();
                    console.log('🔄 Produits synchronisés automatiquement');
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification des mises à jour:', error);
        }
    }
    
    // Afficher une notification de mise à jour
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-sync-alt"></i>
                <span>Données mises à jour !</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer automatiquement après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Actualiser les données
    refresh() {
        this.loadData();
        this.renderCategories();
        this.renderFeaturedProducts();
    }

    // Rechercher dans les catégories
    searchCategories(query) {
        const filtered = this.state.categories.filter(category =>
            category.name.toLowerCase().includes(query.toLowerCase()) ||
            category.description.toLowerCase().includes(query.toLowerCase())
        );
        
        return filtered;
    }

    // Obtenir les statistiques
    getStats() {
        return {
            totalCategories: this.state.categories.length,
            totalProducts: this.state.productsData.length,
            featuredProducts: this.state.productsData.filter(p => p.featured).length,
            averageProductsPerCategory: this.state.productsData.length / this.state.categories.length
        };
    }

    // Gérer les erreurs
    handleError(error) {
        // Afficher un message d'erreur utilisateur
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        
        // Enregistrer l'erreur pour le développement
        console.error('Erreur:', error);
    }

    // Démarrer le rafraîchissement automatique
    startAutoRefresh() {
        setInterval(() => {
            this.refresh();
        }, this.config.refreshInterval);
    }

    // Obtenir les catégories par défaut
    getDefaultCategories() {
        return [
            {
                id: 1,
                name: 'Électronique',
                description: 'Appareils électroniques et high-tech',
                icon: 'fas fa-laptop',
                color: '#667eea',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                products: [],
                isActive: true,
                order: 1,
                image: '/assets/categories/electronics.jpg',
                seo: {
                    title: 'Électronique professionnelle - Mireb B2B',
                    description: 'Découvrez notre gamme d\'appareils électroniques pour professionnels'
                }
            },
            {
                id: 2,
                name: 'Mode & Vêtements',
                description: 'Vêtements et accessoires de mode',
                icon: 'fas fa-tshirt',
                color: '#764ba2',
                gradient: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                products: [],
                isActive: true,
                order: 2,
                image: '/assets/categories/fashion.jpg',
                seo: {
                    title: 'Mode professionnelle - Mireb B2B',
                    description: 'Vêtements et accessoires de mode pour entreprises'
                }
            },
            {
                id: 3,
                name: 'Maison & Jardin',
                description: 'Articles pour la maison et le jardin',
                icon: 'fas fa-home',
                color: '#f093fb',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                products: [],
                isActive: true,
                order: 3,
                image: '/assets/categories/home.jpg',
                seo: {
                    title: 'Équipements maison et jardin - Mireb B2B',
                    description: 'Tout pour équiper votre maison et votre jardin'
                }
            },
            {
                id: 4,
                name: 'Sport & Loisirs',
                description: 'Équipements sportifs et loisirs',
                icon: 'fas fa-futbol',
                color: '#4facfe',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                products: [],
                isActive: true,
                order: 4,
                image: '/assets/categories/sports.jpg',
                seo: {
                    title: 'Équipements sportifs professionnels - Mireb B2B',
                    description: 'Matériel de sport et loisirs pour professionnels'
                }
            },
            {
                id: 5,
                name: 'Beauté & Santé',
                description: 'Produits de beauté et de santé',
                icon: 'fas fa-heart',
                color: '#fa709a',
                gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                products: [],
                isActive: true,
                order: 5,
                image: '/assets/categories/beauty.jpg',
                seo: {
                    title: 'Produits beauté et santé - Mireb B2B',
                    description: 'Gamme complète de produits beauté et santé'
                }
            },
            {
                id: 6,
                name: 'Alimentation',
                description: 'Produits alimentaires et boissons',
                icon: 'fas fa-utensils',
                color: '#a8edea',
                gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                products: [],
                isActive: true,
                order: 6,
                image: '/assets/categories/food.jpg',
                seo: {
                    title: 'Alimentation professionnelle - Mireb B2B',
                    description: 'Produits alimentaires et boissons pour professionnels'
                }
            }
        ];
    }

    // Obtenir les produits par défaut
    getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Ordinateur Portable Pro',
                category: 1,
                price: 899.99,
                originalPrice: 1099.99,
                image: '/assets/products/laptop-pro.jpg',
                description: 'Ordinateur portable haute performance pour professionnels',
                featured: true,
                stock: 15,
                tags: ['nouveau', 'promotion'],
                rating: 4.8,
                reviews: 127,
                sku: 'LAPTOP-PRO-001'
            },
            {
                id: 2,
                name: 'Smartphone Elite',
                category: 1,
                price: 699.99,
                image: '/assets/products/smartphone-elite.jpg',
                description: 'Smartphone dernière génération avec fonctionnalités avancées',
                featured: true,
                stock: 25,
                tags: ['populaire'],
                rating: 4.6,
                reviews: 89,
                sku: 'PHONE-ELITE-002'
            },
            {
                id: 3,
                name: 'Veste Designer',
                category: 2,
                price: 159.99,
                image: '/assets/products/designer-jacket.jpg',
                description: 'Veste élégante pour toute occasion professionnelle',
                featured: true,
                stock: 8,
                tags: ['tendance'],
                rating: 4.7,
                reviews: 54,
                sku: 'JACKET-DES-003'
            },
            {
                id: 4,
                name: 'Ensemble Salon Moderne',
                category: 3,
                price: 1299.99,
                image: '/assets/products/modern-sofa.jpg',
                description: 'Canapé moderne et confortable pour espaces professionnels',
                featured: false,
                stock: 3,
                tags: ['luxe'],
                rating: 4.9,
                reviews: 32,
                sku: 'SOFA-MOD-004'
            },
            {
                id: 5,
                name: 'Kit Fitness Complet',
                category: 4,
                price: 299.99,
                image: '/assets/products/fitness-kit.jpg',
                description: 'Kit complet pour s\'entraîner à domicile ou au bureau',
                featured: true,
                stock: 12,
                tags: ['santé', 'bien-être'],
                rating: 4.5,
                reviews: 76,
                sku: 'FITNESS-KIT-005'
            },
            {
                id: 6,
                name: 'Coffret Beauté Premium',
                category: 5,
                price: 89.99,
                image: '/assets/products/beauty-set.jpg',
                description: 'Coffret de soins premium pour une beauté éclatante',
                featured: false,
                stock: 18,
                tags: ['bio', 'naturel'],
                rating: 4.8,
                reviews: 143,
                sku: 'BEAUTY-PREM-006'
            }
        ];
    }
}

// Initialiser le gestionnaire des catégories
document.addEventListener('DOMContentLoaded', () => {
    window.homepageCategories = new HomepageCategories();
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomepageCategories;
}
