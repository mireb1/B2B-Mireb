// Gestionnaire avancé de produits et catégories avec synchronisation Shopify-style
// Upload de fichiers, gestion complète des données de la page d'accueil

class MirebProductManager {
    constructor() {
        this.defaultCategories = [
            { id: 1, name: 'Santé', icon: 'fas fa-heartbeat', color: '#e74c3c', position: 'top' },
            { id: 2, name: 'Cosmétiques', icon: 'fas fa-spa', color: '#9b59b6', position: 'top' },
            { id: 3, name: 'Électronique', icon: 'fas fa-microchip', color: '#3498db', position: 'top' },
            { id: 4, name: 'Mode', icon: 'fas fa-tshirt', color: '#f39c12', position: 'top' },
            { id: 5, name: 'Maison', icon: 'fas fa-home', color: '#2ecc71', position: 'bottom' },
            { id: 6, name: 'Alimentaire', icon: 'fas fa-utensils', color: '#e67e22', position: 'bottom' },
            { id: 7, name: 'Automobile', icon: 'fas fa-car', color: '#34495e', position: 'bottom' },
            { id: 8, name: 'Outils', icon: 'fas fa-tools', color: '#95a5a6', position: 'bottom' }
        ];

        this.defaultFeaturedProducts = [
            { id: 1, name: 'Casque Audio Premium', price: 299, description: 'Son haute qualité', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', category: 3, featured: true },
            { id: 2, name: 'Montre Connectée Pro', price: 450, description: 'Technologie avancée', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', category: 3, featured: true },
            { id: 3, name: 'Laptop Business', price: 1299, description: 'Performance et mobilité', image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=300&h=200&fit=crop', category: 3, featured: true },
            { id: 4, name: 'Chaise Ergonomique', price: 350, description: 'Confort optimal', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop', category: 5, featured: true }
        ];

        this.defaultRegularProducts = [
            { id: 5, name: 'Smartphone Pro', price: 799, description: 'Communication professionnelle', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop', category: 3, featured: false },
            { id: 6, name: 'Équipement Bureau', price: 180, description: 'Accessoires professionnels', image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=200&fit=crop', category: 8, featured: false },
            { id: 7, name: 'Tablette Pro', price: 650, description: 'Mobilité et performance', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop', category: 3, featured: false },
            { id: 8, name: 'Caméra HD', price: 420, description: 'Qualité professionnelle', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop', category: 3, featured: false },
            { id: 9, name: 'Écran 4K', price: 899, description: 'Résolution ultra haute', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop', category: 3, featured: false },
            { id: 10, name: 'Clavier Mécanique', price: 120, description: 'Frappe précise', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop', category: 3, featured: false }
        ];

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.syncWithHomepage();
        console.log('🛍️ Gestionnaire de produits Mireb initialisé');
    }

    // Charger les données depuis localStorage ou utiliser les valeurs par défaut
    loadData() {
        try {
            // Charger les catégories
            const savedCategories = localStorage.getItem('mireb_categories');
            this.categories = savedCategories ? JSON.parse(savedCategories) : [...this.defaultCategories];

            // Charger les produits
            const savedProducts = localStorage.getItem('mireb_products');
            if (savedProducts) {
                this.products = JSON.parse(savedProducts);
            } else {
                this.products = [...this.defaultFeaturedProducts, ...this.defaultRegularProducts];
            }

            console.log('📦 Données chargées:', {
                categories: this.categories.length,
                products: this.products.length,
                featuredProducts: this.products.filter(p => p.featured).length
            });
        } catch (error) {
            console.error('❌ Erreur lors du chargement des données:', error);
            this.categories = [...this.defaultCategories];
            this.products = [...this.defaultFeaturedProducts, ...this.defaultRegularProducts];
        }
    }

    // Sauvegarder les données
    saveData() {
        try {
            localStorage.setItem('mireb_categories', JSON.stringify(this.categories));
            localStorage.setItem('mireb_products', JSON.stringify(this.products));
            this.syncWithHomepage();
            console.log('💾 Données sauvegardées et synchronisées');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
        }
    }

    // Synchroniser avec la page d'accueil
    syncWithHomepage() {
        try {
            // Déclencher un événement pour notifier la page d'accueil
            window.dispatchEvent(new CustomEvent('mirebDataUpdated', {
                detail: {
                    categories: this.categories,
                    products: this.products,
                    featuredProducts: this.products.filter(p => p.featured),
                    regularProducts: this.products.filter(p => !p.featured),
                    timestamp: Date.now()
                }
            }));

            console.log('🔄 Synchronisation avec la page d\'accueil effectuée');
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation:', error);
        }
    }

    // Ajouter une catégorie
    addCategory(categoryData) {
        try {
            const newCategory = {
                id: Date.now(),
                name: categoryData.name,
                icon: categoryData.icon || 'fas fa-folder',
                color: categoryData.color || '#3498db',
                position: categoryData.position || 'bottom'
            };

            this.categories.push(newCategory);
            this.saveData();
            return newCategory;
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de la catégorie:', error);
            throw error;
        }
    }

    // Modifier une catégorie
    updateCategory(id, categoryData) {
        try {
            const index = this.categories.findIndex(c => c.id === id);
            if (index !== -1) {
                this.categories[index] = { ...this.categories[index], ...categoryData };
                this.saveData();
                return this.categories[index];
            }
            throw new Error('Catégorie non trouvée');
        } catch (error) {
            console.error('❌ Erreur lors de la modification de la catégorie:', error);
            throw error;
        }
    }

    // Supprimer une catégorie
    deleteCategory(id) {
        try {
            this.categories = this.categories.filter(c => c.id !== id);
            this.saveData();
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la suppression de la catégorie:', error);
            throw error;
        }
    }

    // Ajouter un produit
    addProduct(productData) {
        try {
            const newProduct = {
                id: Date.now(),
                name: productData.name,
                price: parseFloat(productData.price),
                description: productData.description,
                image: productData.image || 'https://via.placeholder.com/300x200?text=Produit',
                category: parseInt(productData.category),
                featured: productData.featured || false,
                stock: parseInt(productData.stock) || 0,
                status: productData.status || 'active'
            };

            this.products.push(newProduct);
            this.saveData();
            return newProduct;
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout du produit:', error);
            throw error;
        }
    }

    // Modifier un produit
    updateProduct(id, productData) {
        try {
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
                this.saveData();
                return this.products[index];
            }
            throw new Error('Produit non trouvé');
        } catch (error) {
            console.error('❌ Erreur lors de la modification du produit:', error);
            throw error;
        }
    }

    // Supprimer un produit
    deleteProduct(id) {
        try {
            this.products = this.products.filter(p => p.id !== id);
            this.saveData();
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la suppression du produit:', error);
            throw error;
        }
    }

    // Upload d'image avec conversion en base64 pour téléchargement mobile
    uploadImage(file) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageData = {
                        url: e.target.result,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        downloadLink: e.target.result // Lien de téléchargement pour mobile
                    };
                    resolve(imageData);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Créer un lien de téléchargement pour mobile
    createDownloadLink(imageData, fileName) {
        try {
            const link = document.createElement('a');
            link.href = imageData.url;
            link.download = fileName || imageData.name || 'image';
            return link;
        } catch (error) {
            console.error('❌ Erreur lors de la création du lien de téléchargement:', error);
            return null;
        }
    }

    // Obtenir les catégories par position
    getCategoriesByPosition(position) {
        return this.categories.filter(c => c.position === position);
    }

    // Obtenir les produits vedettes
    getFeaturedProducts() {
        return this.products.filter(p => p.featured && p.status === 'active');
    }

    // Obtenir les produits réguliers
    getRegularProducts() {
        return this.products.filter(p => !p.featured && p.status === 'active');
    }

    // Rechercher des produits
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    // Configurer les écouteurs d'événements
    setupEventListeners() {
        // Écouter les changements de devise
        document.addEventListener('currencyChanged', (e) => {
            this.updatePricesDisplay(e.detail.currency, e.detail.rate);
        });

        // Écouter les demandes de synchronisation
        document.addEventListener('requestSync', () => {
            this.syncWithHomepage();
        });
    }

    // Mettre à jour l'affichage des prix selon la devise
    updatePricesDisplay(currency, rate) {
        // Cette fonction sera appelée quand la devise change
        console.log(`💱 Mise à jour des prix en ${currency} avec le taux ${rate}`);
    }

    // Exporter les données vers un fichier JSON
    exportData() {
        try {
            const data = {
                categories: this.categories,
                products: this.products,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mireb-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            console.log('📥 Données exportées avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            return false;
        }
    }

    // Importer des données depuis un fichier JSON
    importData(file) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.categories && data.products) {
                            this.categories = data.categories;
                            this.products = data.products;
                            this.saveData();
                            console.log('📤 Données importées avec succès');
                            resolve(true);
                        } else {
                            throw new Error('Format de fichier invalide');
                        }
                    } catch (parseError) {
                        reject(parseError);
                    }
                };
                reader.onerror = reject;
                reader.readAsText(file);
            } catch (error) {
                reject(error);
            }
        });
    }
}

// Initialiser le gestionnaire de produits
window.mirebProductManager = new MirebProductManager();
