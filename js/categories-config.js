// Configuration des catégories pour Mireb Commercial
// Système de gestion avancé des catégories avec icônes et couleurs

class CategoriesConfig {
    constructor() {
        this.categories = [
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
                seo: {
                    title: 'Électronique - Mireb Commercial',
                    description: 'Découvrez notre gamme d\'appareils électroniques',
                    keywords: 'électronique, ordinateurs, smartphones, high-tech'
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
                seo: {
                    title: 'Mode & Vêtements - Mireb Commercial',
                    description: 'Collection de vêtements et accessoires tendance',
                    keywords: 'mode, vêtements, accessoires, fashion'
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
                seo: {
                    title: 'Maison & Jardin - Mireb Commercial',
                    description: 'Tout pour votre maison et votre jardin',
                    keywords: 'maison, jardin, décoration, mobilier'
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
                seo: {
                    title: 'Sport & Loisirs - Mireb Commercial',
                    description: 'Équipements sportifs et articles de loisirs',
                    keywords: 'sport, loisirs, fitness, équipements'
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
                seo: {
                    title: 'Beauté & Santé - Mireb Commercial',
                    description: 'Produits de beauté et soins de santé',
                    keywords: 'beauté, santé, cosmétiques, soins'
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
                seo: {
                    title: 'Alimentation - Mireb Commercial',
                    description: 'Produits alimentaires de qualité',
                    keywords: 'alimentation, nourriture, boissons, épicerie'
                }
            }
        ];
        
        this.socialNetworks = {
            facebook: {
                pageId: '',
                accessToken: '',
                isActive: false
            },
            instagram: {
                businessAccountId: '',
                accessToken: '',
                isActive: false
            },
            whatsapp: {
                businessAccountId: '',
                phoneNumber: '',
                accessToken: '',
                isActive: false
            },
            tiktok: {
                businessAccountId: '',
                accessToken: '',
                isActive: false
            }
        };
    }

    // Obtenir toutes les catégories actives
    getActiveCategories() {
        return this.categories.filter(cat => cat.isActive).sort((a, b) => a.order - b.order);
    }

    // Obtenir une catégorie par ID
    getCategoryById(id) {
        return this.categories.find(cat => cat.id === parseInt(id));
    }

    // Ajouter une nouvelle catégorie
    addCategory(categoryData) {
        const newId = Math.max(...this.categories.map(c => c.id), 0) + 1;
        const newCategory = {
            id: newId,
            name: categoryData.name,
            description: categoryData.description,
            icon: categoryData.icon || 'fas fa-folder',
            color: categoryData.color || '#667eea',
            gradient: categoryData.gradient || `linear-gradient(135deg, ${categoryData.color || '#667eea'} 0%, #764ba2 100%)`,
            products: [],
            isActive: true,
            order: this.categories.length + 1,
            seo: {
                title: `${categoryData.name} - Mireb Commercial`,
                description: categoryData.description || `Découvrez notre gamme ${categoryData.name}`,
                keywords: categoryData.name.toLowerCase()
            }
        };
        
        this.categories.push(newCategory);
        this.saveToLocalStorage();
        return newCategory;
    }

    // Mettre à jour une catégorie
    updateCategory(id, updateData) {
        const categoryIndex = this.categories.findIndex(cat => cat.id === parseInt(id));
        if (categoryIndex !== -1) {
            this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...updateData };
            this.saveToLocalStorage();
            return this.categories[categoryIndex];
        }
        return null;
    }

    // Supprimer une catégorie
    deleteCategory(id) {
        const categoryIndex = this.categories.findIndex(cat => cat.id === parseInt(id));
        if (categoryIndex !== -1) {
            this.categories.splice(categoryIndex, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Réorganiser les catégories
    reorderCategories(newOrder) {
        newOrder.forEach((id, index) => {
            const category = this.getCategoryById(id);
            if (category) {
                category.order = index + 1;
            }
        });
        this.saveToLocalStorage();
    }

    // Publier une catégorie sur les réseaux sociaux
    async publishCategoryToSocial(categoryId, networks = ['facebook', 'instagram']) {
        const category = this.getCategoryById(categoryId);
        if (!category) return { success: false, message: 'Catégorie non trouvée' };

        const results = {};
        
        for (const network of networks) {
            try {
                const result = await this.publishToNetwork(category, network);
                results[network] = result;
            } catch (error) {
                results[network] = { success: false, error: error.message };
            }
        }

        return results;
    }

    // Publier sur un réseau spécifique
    async publishToNetwork(category, network) {
        const networkConfig = this.socialNetworks[network];
        if (!networkConfig || !networkConfig.isActive) {
            throw new Error(`${network} n'est pas configuré ou activé`);
        }

        const content = this.generateSocialContent(category, network);
        
        // Simulation de publication (à remplacer par vraies API)
        console.log(`📱 Publication sur ${network}:`, content);
        
        // Ici, vous intégreriez les vraies API des réseaux sociaux
        switch (network) {
            case 'facebook':
                return await this.publishToFacebook(content, networkConfig);
            case 'instagram':
                return await this.publishToInstagram(content, networkConfig);
            case 'whatsapp':
                return await this.publishToWhatsApp(content, networkConfig);
            default:
                throw new Error(`Réseau ${network} non supporté`);
        }
    }

    // Générer le contenu pour les réseaux sociaux
    generateSocialContent(category, network) {
        const baseContent = {
            title: `🛍️ Découvrez notre catégorie ${category.name}`,
            description: category.description,
            hashtags: ['#MirebCommercial', `#${category.name.replace(/\s+/g, '')}`, '#Ecommerce', '#Shopping'],
            link: `${window.location.origin}/produits.html?category=${category.id}`,
            image: category.image || '/assets/categories/default.jpg'
        };

        switch (network) {
            case 'facebook':
                return {
                    ...baseContent,
                    message: `${baseContent.title}\n\n${baseContent.description}\n\n${baseContent.hashtags.join(' ')}\n\n👉 ${baseContent.link}`
                };
            case 'instagram':
                return {
                    ...baseContent,
                    caption: `${baseContent.title}\n\n${baseContent.description}\n\n${baseContent.hashtags.join(' ')}`
                };
            case 'whatsapp':
                return {
                    ...baseContent,
                    message: `${baseContent.title}\n${baseContent.description}\n\nVoir les produits: ${baseContent.link}`
                };
            default:
                return baseContent;
        }
    }

    // Publier sur Facebook (simulation)
    async publishToFacebook(content, config) {
        // Simulation - remplacer par vraie API Facebook
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    postId: 'fb_' + Date.now(),
                    message: 'Publié sur Facebook avec succès'
                });
            }, 1000);
        });
    }

    // Publier sur Instagram (simulation)
    async publishToInstagram(content, config) {
        // Simulation - remplacer par vraie API Instagram
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    postId: 'ig_' + Date.now(),
                    message: 'Publié sur Instagram avec succès'
                });
            }, 1000);
        });
    }

    // Publier sur WhatsApp (simulation)
    async publishToWhatsApp(content, config) {
        // Simulation - remplacer par vraie API WhatsApp Business
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    messageId: 'wa_' + Date.now(),
                    message: 'Envoyé via WhatsApp avec succès'
                });
            }, 1000);
        });
    }

    // Configurer les réseaux sociaux
    configureSocialNetwork(network, config) {
        if (this.socialNetworks[network]) {
            this.socialNetworks[network] = { ...this.socialNetworks[network], ...config };
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Sauvegarder dans le localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('mireb_categories', JSON.stringify(this.categories));
            localStorage.setItem('mireb_social_networks', JSON.stringify(this.socialNetworks));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    }

    // Charger depuis le localStorage
    loadFromLocalStorage() {
        try {
            const savedCategories = localStorage.getItem('mireb_categories');
            const savedSocialNetworks = localStorage.getItem('mireb_social_networks');
            
            if (savedCategories) {
                this.categories = JSON.parse(savedCategories);
            }
            
            if (savedSocialNetworks) {
                this.socialNetworks = JSON.parse(savedSocialNetworks);
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        }
    }

    // Exporter la configuration
    exportConfig() {
        return {
            categories: this.categories,
            socialNetworks: this.socialNetworks,
            exportDate: new Date().toISOString()
        };
    }

    // Importer la configuration
    importConfig(configData) {
        try {
            if (configData.categories) {
                this.categories = configData.categories;
            }
            if (configData.socialNetworks) {
                this.socialNetworks = configData.socialNetworks;
            }
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            return false;
        }
    }
}

// Initialiser la configuration des catégories
window.categoriesConfig = new CategoriesConfig();
window.categoriesConfig.loadFromLocalStorage();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoriesConfig;
}
