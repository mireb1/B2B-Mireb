// Interface Admin Style Shopify avec Upload d'Images et Synchronisation
// Gestion complète des produits et catégories

class ShopifyAdminInterface {
    constructor() {
        this.currentProductImages = [];
        this.currentEditingProduct = null;
        this.currentEditingCategory = null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupImageUpload();
        this.loadData();
        this.setupEventListeners();
        console.log('🛍️ Interface Admin Shopify initialisée');
    }

    // Navigation entre les onglets
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const tabContents = document.querySelectorAll('.tab-content');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');

                // Désactiver tous les onglets
                navLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(t => t.classList.remove('active'));

                // Activer l'onglet sélectionné
                link.classList.add('active');
                document.getElementById(tabId + '-tab').classList.add('active');

                // Charger les données de l'onglet
                this.loadTabData(tabId);
            });
        });
    }

    // Configuration de l'upload d'images
    setupImageUpload() {
        const uploadArea = document.getElementById('product-upload-area');
        const fileInput = document.getElementById('product-image-input');

        if (uploadArea && fileInput) {
            // Clic sur la zone d'upload
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Sélection de fichier
            fileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files);
            });

            // Drag & Drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleImageUpload(e.dataTransfer.files);
            });
        }
    }

    // Gérer l'upload d'images
    async handleImageUpload(files) {
        try {
            const file = files[0];
            if (!file || !file.type.startsWith('image/')) {
                this.showNotification('Veuillez sélectionner une image valide', 'error');
                return;
            }

            // Limiter la taille (5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification('L\'image est trop volumineuse (max. 5MB)', 'error');
                return;
            }

            const imageData = await window.mirebProductManager.uploadImage(file);
            this.currentProductImages = [imageData];
            this.displayImagePreview(imageData);

            this.showNotification('Image uploadée avec succès!', 'success');
        } catch (error) {
            console.error('❌ Erreur lors de l\'upload:', error);
            this.showNotification('Erreur lors de l\'upload de l\'image', 'error');
        }
    }

    // Afficher l'aperçu de l'image
    displayImagePreview(imageData) {
        const previewContainer = document.getElementById('product-image-preview');
        if (!previewContainer) return;

        previewContainer.innerHTML = `
            <div class="preview-item">
                <img src="${imageData.url}" alt="Aperçu">
                <button class="preview-remove" onclick="this.removeImagePreview()">×</button>
                <a href="${imageData.downloadLink}" download="${imageData.name}" class="download-link">
                    <i class="fas fa-download"></i> Télécharger
                </a>
            </div>
        `;
    }

    // Supprimer l'aperçu d'image
    removeImagePreview() {
        this.currentProductImages = [];
        document.getElementById('product-image-preview').innerHTML = '';
    }

    // Charger les données
    loadData() {
        this.loadProducts();
        this.loadCategories();
        this.loadCategoryOptions();
    }

    // Charger les données d'un onglet
    loadTabData(tabId) {
        switch(tabId) {
            case 'products':
                this.loadProducts();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'import-export':
            case 'settings':
                // Pas de données à charger
                break;
        }
    }

    // Charger les produits
    loadProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        const products = window.mirebProductManager.products;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <p>Aucun produit trouvé</p>
                    <button class="btn-primary" onclick="shopifyAdmin.openProductModal()">
                        <i class="fas fa-plus"></i> Ajouter votre premier produit
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => {
            const category = window.mirebProductManager.categories.find(c => c.id === product.category);
            return `
                <div class="product-card-admin">
                    <div class="product-image-admin">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x160?text=Image+non+disponible'">
                        ${product.featured ? '<span class="badge badge-featured">Vedette</span>' : ''}
                    </div>
                    <div class="product-info-admin">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">${product.price}€</div>
                        <p class="product-description">${product.description}</p>
                        <div style="margin-bottom: 12px;">
                            <span class="badge badge-active">${category ? category.name : 'Sans catégorie'}</span>
                            <span class="badge" style="background: #f1f2f3; color: #6d7175;">Stock: ${product.stock || 0}</span>
                        </div>
                        <div class="product-actions">
                            <button class="btn-secondary" onclick="shopifyAdmin.editProduct(${product.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-secondary" onclick="shopifyAdmin.deleteProduct(${product.id})" style="color: #d72c0d;">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Charger les catégories
    loadCategories() {
        const container = document.getElementById('categories-container');
        if (!container) return;

        const categories = window.mirebProductManager.categories;

        if (categories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <p>Aucune catégorie trouvée</p>
                    <button class="btn-primary" onclick="shopifyAdmin.openCategoryModal()">
                        <i class="fas fa-plus"></i> Ajouter votre première catégorie
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = categories.map(category => `
            <div class="category-card-admin">
                <div class="category-icon-admin" style="background-color: ${category.color}">
                    <i class="${category.icon}"></i>
                </div>
                <h3 class="category-name">${category.name}</h3>
                <p style="color: #6d7175; font-size: 14px; margin: 0 0 12px 0;">
                    Position: ${category.position === 'top' ? 'Haut de page' : 'Bas de page'}
                </p>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="shopifyAdmin.editCategory(${category.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-secondary" onclick="shopifyAdmin.deleteCategory(${category.id})" style="color: #d72c0d;">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Charger les options de catégories dans le formulaire produit
    loadCategoryOptions() {
        const select = document.getElementById('product-category');
        if (!select) return;

        const categories = window.mirebProductManager.categories;
        select.innerHTML = '<option value="">Sélectionner une catégorie</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }

    // Ouvrir le modal produit
    openProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        
        if (productId) {
            const product = window.mirebProductManager.products.find(p => p.id === productId);
            if (product) {
                title.textContent = 'Modifier le produit';
                this.fillProductForm(product);
                this.currentEditingProduct = productId;
            }
        } else {
            title.textContent = 'Nouveau produit';
            this.resetProductForm();
            this.currentEditingProduct = null;
        }

        modal.style.display = 'flex';
    }

    // Remplir le formulaire produit
    fillProductForm(product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-featured').checked = product.featured;

        // Afficher l'image actuelle
        if (product.image) {
            this.displayImagePreview({
                url: product.image,
                name: 'image-actuelle.jpg',
                downloadLink: product.image
            });
            this.currentProductImages = [{url: product.image}];
        }
    }

    // Réinitialiser le formulaire produit
    resetProductForm() {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        this.currentProductImages = [];
        document.getElementById('product-image-preview').innerHTML = '';
    }

    // Fermer le modal produit
    closeProductModal() {
        document.getElementById('product-modal').style.display = 'none';
        this.resetProductForm();
    }

    // Sauvegarder le produit
    async saveProduct() {
        try {
            const productData = {
                name: document.getElementById('product-name').value,
                price: parseFloat(document.getElementById('product-price').value),
                description: document.getElementById('product-description').value,
                category: parseInt(document.getElementById('product-category').value),
                stock: parseInt(document.getElementById('product-stock').value) || 0,
                featured: document.getElementById('product-featured').checked,
                image: this.currentProductImages.length > 0 ? this.currentProductImages[0].url : 'https://via.placeholder.com/300x200?text=Produit'
            };

            if (this.currentEditingProduct) {
                await window.mirebProductManager.updateProduct(this.currentEditingProduct, productData);
                this.showNotification('Produit modifié avec succès!', 'success');
            } else {
                await window.mirebProductManager.addProduct(productData);
                this.showNotification('Produit ajouté avec succès!', 'success');
            }

            this.closeProductModal();
            this.loadProducts();
            this.loadCategoryOptions();
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            this.showNotification('Erreur lors de la sauvegarde du produit', 'error');
        }
    }

    // Modifier un produit
    editProduct(productId) {
        this.openProductModal(productId);
    }

    // Supprimer un produit
    async deleteProduct(productId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }

        try {
            await window.mirebProductManager.deleteProduct(productId);
            this.showNotification('Produit supprimé avec succès!', 'success');
            this.loadProducts();
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            this.showNotification('Erreur lors de la suppression du produit', 'error');
        }
    }

    // Ouvrir le modal catégorie
    openCategoryModal(categoryId = null) {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        
        if (categoryId) {
            const category = window.mirebProductManager.categories.find(c => c.id === categoryId);
            if (category) {
                title.textContent = 'Modifier la catégorie';
                this.fillCategoryForm(category);
                this.currentEditingCategory = categoryId;
            }
        } else {
            title.textContent = 'Nouvelle catégorie';
            this.resetCategoryForm();
            this.currentEditingCategory = null;
        }

        modal.style.display = 'flex';
    }

    // Remplir le formulaire catégorie
    fillCategoryForm(category) {
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-icon').value = category.icon;
        document.getElementById('category-color').value = category.color;
        document.getElementById('category-position').value = category.position;
    }

    // Réinitialiser le formulaire catégorie
    resetCategoryForm() {
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
    }

    // Fermer le modal catégorie
    closeCategoryModal() {
        document.getElementById('category-modal').style.display = 'none';
        this.resetCategoryForm();
    }

    // Sauvegarder la catégorie
    async saveCategory() {
        try {
            const categoryData = {
                name: document.getElementById('category-name').value,
                icon: document.getElementById('category-icon').value || 'fas fa-folder',
                color: document.getElementById('category-color').value,
                position: document.getElementById('category-position').value
            };

            if (this.currentEditingCategory) {
                await window.mirebProductManager.updateCategory(this.currentEditingCategory, categoryData);
                this.showNotification('Catégorie modifiée avec succès!', 'success');
            } else {
                await window.mirebProductManager.addCategory(categoryData);
                this.showNotification('Catégorie ajoutée avec succès!', 'success');
            }

            this.closeCategoryModal();
            this.loadCategories();
            this.loadCategoryOptions();
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            this.showNotification('Erreur lors de la sauvegarde de la catégorie', 'error');
        }
    }

    // Modifier une catégorie
    editCategory(categoryId) {
        this.openCategoryModal(categoryId);
    }

    // Supprimer une catégorie
    async deleteCategory(categoryId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            return;
        }

        try {
            await window.mirebProductManager.deleteCategory(categoryId);
            this.showNotification('Catégorie supprimée avec succès!', 'success');
            this.loadCategories();
            this.loadCategoryOptions();
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            this.showNotification('Erreur lors de la suppression de la catégorie', 'error');
        }
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'sync-notification';
        notification.style.background = type === 'success' ? '#008060' : type === 'error' ? '#d72c0d' : '#202223';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // Configurer les écouteurs d'événements
    setupEventListeners() {
        // Fermer les modals en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }
}

// Fonctions globales pour l'interface
window.openProductModal = () => shopifyAdmin.openProductModal();
window.openCategoryModal = () => shopifyAdmin.openCategoryModal();
window.closeProductModal = () => shopifyAdmin.closeProductModal();
window.closeCategoryModal = () => shopifyAdmin.closeCategoryModal();
window.saveProduct = () => shopifyAdmin.saveProduct();
window.saveCategory = () => shopifyAdmin.saveCategory();

// Fonctions pour l'import/export
window.exportData = () => {
    const success = window.mirebProductManager.exportData();
    if (success) {
        shopifyAdmin.showNotification('Données exportées avec succès!', 'success');
    } else {
        shopifyAdmin.showNotification('Erreur lors de l\'export', 'error');
    }
};

window.importData = () => {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        shopifyAdmin.showNotification('Veuillez sélectionner un fichier', 'error');
        return;
    }

    window.mirebProductManager.importData(file)
        .then(() => {
            shopifyAdmin.showNotification('Données importées avec succès!', 'success');
            shopifyAdmin.loadData();
        })
        .catch((error) => {
            console.error('❌ Erreur import:', error);
            shopifyAdmin.showNotification('Erreur lors de l\'import', 'error');
        });
};

// Fonctions pour les paramètres
window.forcSync = () => {
    window.mirebProductManager.syncWithHomepage();
    shopifyAdmin.showNotification('Synchronisation effectuée!', 'success');
};

window.resetData = () => {
    if (confirm('Êtes-vous sûr de vouloir restaurer les données par défaut ? Cette action est irréversible.')) {
        localStorage.removeItem('mireb_categories');
        localStorage.removeItem('mireb_products');
        window.location.reload();
    }
};

// Initialiser l'interface quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    window.shopifyAdmin = new ShopifyAdminInterface();
});
