/**
 * Gestion des produits, détails, commandes et suivi de livraison
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de l'API
    const api = new ApiService();
    
    // Éléments DOM pour les produits
    const productList = document.querySelector('.product-list');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const filterButton = document.getElementById('filter-button');
    const filtersPanel = document.getElementById('filters-panel');
    const sortSelect = document.getElementById('sort-select');
    const activeFiltersContainer = document.getElementById('active-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    // Éléments DOM pour le détail du produit
    const productDetailModal = document.getElementById('product-detail-modal');
    const orderModal = document.getElementById('order-modal');
    const orderForm = document.getElementById('order-form');
    
    // Variables d'état
    let products = [];
    let categories = [];
    let currentFilters = {
        categories: [],
        priceRange: {min: null, max: null},
        promotions: [],
        inStock: false
    };
    let currentSort = 'popular';
    let currentView = 'grid'; // 'grid' ou 'list'
    
    // Fonction pour charger les produits
    async function loadProducts() {
        try {
            // Essayer d'abord d'obtenir les produits depuis l'API
            const response = await api.get('/products');
            products = response;
        } catch (error) {
            console.warn('Erreur lors du chargement des produits depuis l\'API:', error);
            
            // Fallback: utiliser les produits du localStorage
            products = JSON.parse(localStorage.getItem('products') || '[]');
        }
        
        renderProducts();
    }
    
    // Fonction pour charger les catégories
    async function loadCategories() {
        try {
            const response = await api.get('/categories');
            categories = response;
        } catch (error) {
            console.warn('Erreur lors du chargement des catégories:', error);
            
            // Fallback: catégories en dur
            categories = [
                { name: 'Santé', slug: 'health', icon: 'fas fa-heartbeat' },
                { name: 'Cosmétiques', slug: 'cosmetics', icon: 'fas fa-spa' },
                { name: 'Bien-être', slug: 'wellness', icon: 'fas fa-hot-tub' },
                { name: 'Biotechnologie', slug: 'biotechnology', icon: 'fas fa-dna' },
                { name: 'Mode', slug: 'fashion', icon: 'fas fa-tshirt' },
                { name: 'Maison', slug: 'home', icon: 'fas fa-home' },
                { name: 'IT', slug: 'it', icon: 'fas fa-laptop-code' },
                { name: 'Électronique', slug: 'electronics', icon: 'fas fa-microchip' },
                { name: 'Accessoires', slug: 'accessories', icon: 'fas fa-headphones' },
                { name: 'Téléphonie', slug: 'phone', icon: 'fas fa-mobile-alt' }
            ];
        }
    }
    
    // Fonction pour afficher les produits
    function renderProducts() {
        if (!productList) return;
        
        // Filtrer les produits
        const filteredProducts = filterProducts();
        
        // Trier les produits
        const sortedProducts = sortProducts(filteredProducts);
        
        // Vider la liste
        productList.innerHTML = '';
        
        // Définir la vue (grille ou liste)
        productList.className = `product-list ${currentView}-view`;
        
        // Afficher les produits
        sortedProducts.forEach(product => {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
        
        // Message si aucun produit
        if (sortedProducts.length === 0) {
            const noProductsMessage = document.createElement('div');
            noProductsMessage.className = 'no-products';
            noProductsMessage.textContent = 'Aucun produit ne correspond à vos critères de recherche.';
            productList.appendChild(noProductsMessage);
        }
    }
    
    // Fonction pour créer un élément produit
    function createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.dataset.id = product.id;
        productDiv.dataset.category = product.category;
        
        // Badges (catégorie, promotion)
        const badge = document.createElement('div');
        badge.className = 'product-badge';
        badge.textContent = getCategoryName(product.category);
        productDiv.appendChild(badge);
        
        if (product.promotionLabel && product.promotionLabel !== 'none') {
            const promoDiv = document.createElement('div');
            promoDiv.className = `promotion-badge ${product.promotionLabel}`;
            promoDiv.textContent = getPromotionText(product.promotionLabel);
            productDiv.appendChild(promoDiv);
        }
        
        // Image
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/300x200/3f51b5/ffffff?text=' + encodeURIComponent(product.name);
        };
        productDiv.appendChild(img);
        
        // Informations du produit
        const infoDiv = document.createElement('div');
        infoDiv.className = 'product-info';
        
        const name = document.createElement('h4');
        name.textContent = product.name;
        infoDiv.appendChild(name);
        
        const description = document.createElement('p');
        description.textContent = product.description;
        infoDiv.appendChild(description);
        
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'product-rating';
        ratingDiv.innerHTML = generateStarRating(product.rating || product.averageRating || 0);
        infoDiv.appendChild(ratingDiv);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'product-actions';
        
        const price = document.createElement('span');
        price.className = 'price';
        price.textContent = product.price.toFixed(2) + ' $';
        actionsDiv.appendChild(price);
        
        const orderBtn = document.createElement('button');
        orderBtn.className = 'order-btn';
        orderBtn.dataset.product = JSON.stringify(product);
        orderBtn.textContent = 'Commander';
        orderBtn.onclick = function(e) {
            e.stopPropagation();
            openOrderModal(product);
        };
        actionsDiv.appendChild(orderBtn);
        
        const detailBtn = document.createElement('button');
        detailBtn.className = 'detail-btn';
        detailBtn.textContent = 'Détails';
        detailBtn.onclick = function(e) {
            e.stopPropagation();
            openProductDetail(product);
        };
        actionsDiv.appendChild(detailBtn);
        
        infoDiv.appendChild(actionsDiv);
        productDiv.appendChild(infoDiv);
        
        // Événement de clic sur le produit entier
        productDiv.addEventListener('click', () => {
            openProductDetail(product);
        });
        
        return productDiv;
    }
    
    // Fonction pour filtrer les produits
    function filterProducts() {
        return products.filter(product => {
            // Filtre par catégories
            if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(product.category)) {
                return false;
            }
            
            // Filtre par prix
            if (currentFilters.priceRange.min !== null && product.price < currentFilters.priceRange.min) {
                return false;
            }
            if (currentFilters.priceRange.max !== null && product.price > currentFilters.priceRange.max) {
                return false;
            }
            
            // Filtre par promotions
            if (currentFilters.promotions.length > 0 && 
                (!product.promotionLabel || !currentFilters.promotions.includes(product.promotionLabel))) {
                return false;
            }
            
            // Filtre par disponibilité
            if (currentFilters.inStock && (!product.inStock || product.inStock <= 0)) {
                return false;
            }
            
            return true;
        });
    }
    
    // Fonction pour trier les produits
    function sortProducts(products) {
        return [...products].sort((a, b) => {
            switch (currentSort) {
                case 'popular':
                    return (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0);
                case 'recent':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }
    
    // Fonction pour afficher le détail d'un produit
    function openProductDetail(product) {
        if (!productDetailModal) return;
        
        // Remplir les détails du produit
        document.getElementById('detail-product-img').src = product.image;
        document.getElementById('detail-product-img').alt = product.name;
        document.getElementById('detail-badge').textContent = getCategoryName(product.category);
        document.getElementById('detail-product-name').textContent = product.name;
        document.getElementById('detail-rating').innerHTML = generateStarRating(product.rating || product.averageRating || 0);
        document.getElementById('detail-price').textContent = product.price.toFixed(2) + ' $';
        
        // Afficher le prix original si en promotion
        if (product.discount && product.discount > 0) {
            const originalPrice = (product.price / (1 - product.discount / 100)).toFixed(2);
            document.getElementById('detail-original-price').textContent = originalPrice + ' $';
            document.getElementById('detail-original-price').style.display = 'inline';
            document.getElementById('detail-discount').textContent = `-${product.discount}%`;
            document.getElementById('detail-discount').style.display = 'inline-block';
        } else {
            document.getElementById('detail-original-price').style.display = 'none';
            document.getElementById('detail-discount').style.display = 'none';
        }
        
        // Disponibilité
        const availabilityElement = document.getElementById('detail-availability');
        if (product.inStock > 10) {
            availabilityElement.textContent = 'En stock';
            availabilityElement.className = 'in-stock';
        } else if (product.inStock > 0) {
            availabilityElement.textContent = `Plus que ${product.inStock} en stock!`;
            availabilityElement.className = 'low-stock';
        } else {
            availabilityElement.textContent = 'Rupture de stock';
            availabilityElement.className = 'out-of-stock';
        }
        
        // Description
        document.getElementById('detail-description').textContent = product.description;
        
        // Spécifications
        const specsTable = document.getElementById('specs-table');
        specsTable.innerHTML = '';
        if (product.specifications && Object.keys(product.specifications).length > 0) {
            Object.entries(product.specifications).forEach(([key, value]) => {
                const row = document.createElement('tr');
                const keyCell = document.createElement('th');
                keyCell.textContent = key;
                const valueCell = document.createElement('td');
                valueCell.textContent = value;
                row.appendChild(keyCell);
                row.appendChild(valueCell);
                specsTable.appendChild(row);
            });
            document.getElementById('product-specifications').style.display = 'block';
        } else {
            document.getElementById('product-specifications').style.display = 'none';
        }
        
        // Configurer le bouton de commande
        const orderBtn = document.getElementById('detail-order-btn');
        orderBtn.onclick = function() {
            openOrderModal(product);
        };
        
        // Afficher les avis clients
        displayProductReviews(product);
        
        // Afficher les produits similaires
        displaySimilarProducts(product);
        
        // Afficher le modal
        productDetailModal.style.display = 'block';
    }
    
    // Fonction pour afficher les avis clients
    function displayProductReviews(product) {
        const reviewsContainer = document.getElementById('product-reviews');
        const noReviewsElement = document.getElementById('no-reviews');
        
        // Vider le conteneur
        reviewsContainer.innerHTML = '';
        reviewsContainer.appendChild(noReviewsElement);
        
        // Vérifier s'il y a des avis
        if (product.ratings && product.ratings.length > 0) {
            noReviewsElement.style.display = 'none';
            
            product.ratings.forEach(rating => {
                const reviewItem = document.createElement('div');
                reviewItem.className = 'review-item';
                
                const reviewHeader = document.createElement('div');
                reviewHeader.className = 'review-header';
                
                const authorSpan = document.createElement('span');
                authorSpan.className = 'review-author';
                authorSpan.textContent = rating.user?.name || 'Client anonyme';
                reviewHeader.appendChild(authorSpan);
                
                const dateSpan = document.createElement('span');
                dateSpan.className = 'review-date';
                const ratingDate = new Date(rating.date);
                dateSpan.textContent = ratingDate.toLocaleDateString('fr-FR');
                reviewHeader.appendChild(dateSpan);
                
                reviewItem.appendChild(reviewHeader);
                
                const ratingDiv = document.createElement('div');
                ratingDiv.className = 'review-rating';
                ratingDiv.innerHTML = generateStarRating(rating.rating);
                reviewItem.appendChild(ratingDiv);
                
                const contentP = document.createElement('p');
                contentP.className = 'review-content';
                contentP.textContent = rating.comment || '';
                reviewItem.appendChild(contentP);
                
                reviewsContainer.appendChild(reviewItem);
            });
        } else {
            noReviewsElement.style.display = 'block';
        }
    }
    
    // Fonction pour afficher les produits similaires
    function displaySimilarProducts(product) {
        const relatedContainer = document.getElementById('related-products');
        relatedContainer.innerHTML = '';
        
        // Trouver des produits de la même catégorie
        const similarProducts = products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
        
        if (similarProducts.length === 0) {
            const noRelatedMessage = document.createElement('p');
            noRelatedMessage.textContent = 'Aucun produit similaire trouvé.';
            noRelatedMessage.style.fontStyle = 'italic';
            noRelatedMessage.style.color = '#888';
            relatedContainer.appendChild(noRelatedMessage);
            return;
        }
        
        similarProducts.forEach(prod => {
            const relatedProduct = document.createElement('div');
            relatedProduct.className = 'related-product';
            relatedProduct.onclick = () => openProductDetail(prod);
            
            const img = document.createElement('img');
            img.src = prod.image;
            img.alt = prod.name;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/150x100/3f51b5/ffffff?text=' + encodeURIComponent(prod.name);
            };
            relatedProduct.appendChild(img);
            
            const name = document.createElement('h5');
            name.textContent = prod.name;
            relatedProduct.appendChild(name);
            
            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = prod.price.toFixed(2) + ' $';
            relatedProduct.appendChild(price);
            
            relatedContainer.appendChild(relatedProduct);
        });
    }
    
    // Fonction pour ouvrir le modal de commande
    function openOrderModal(product) {
        if (!orderModal) return;
        
        // Pré-remplir les données du produit
        document.getElementById('produit-commande').value = product.name;
        document.getElementById('produit-id').value = product.id;
        document.getElementById('produit-price').value = product.price;
        
        // Définir la date minimale de livraison (demain)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        document.getElementById('delivery-date').min = minDate;
        
        // Afficher le modal
        orderModal.style.display = 'block';
        
        // Fermer le modal de détail si ouvert
        if (productDetailModal) {
            productDetailModal.style.display = 'none';
        }
    }
    
    // Fonction pour générer les étoiles de notation
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Étoiles pleines
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // Demi-étoile si nécessaire
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Étoiles vides
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
    
    // Fonction pour obtenir le nom d'une catégorie à partir de son slug
    function getCategoryName(slug) {
        const category = categories.find(cat => cat.slug === slug);
        return category ? category.name : slug;
    }
    
    // Fonction pour obtenir le texte d'une promotion
    function getPromotionText(promotion) {
        switch (promotion) {
            case 'new': return 'Nouveau';
            case 'sale': return 'Soldes';
            case 'hot': return 'Populaire';
            case 'limited': return 'Édition limitée';
            default: return promotion;
        }
    }
    
    // Fonction pour mettre à jour les filtres actifs affichés
    function updateActiveFilters() {
        if (!activeFiltersContainer) return;
        
        activeFiltersContainer.innerHTML = '';
        
        // Ajouter les catégories actives
        currentFilters.categories.forEach(category => {
            addActiveFilter('category', getCategoryName(category), category);
        });
        
        // Ajouter le filtre de prix
        if (currentFilters.priceRange.min !== null || currentFilters.priceRange.max !== null) {
            const minPrice = currentFilters.priceRange.min !== null ? currentFilters.priceRange.min : '';
            const maxPrice = currentFilters.priceRange.max !== null ? currentFilters.priceRange.max : '';
            const priceText = `Prix: ${minPrice} - ${maxPrice} $`;
            addActiveFilter('price', priceText, 'price-range');
        }
        
        // Ajouter les promotions actives
        currentFilters.promotions.forEach(promotion => {
            addActiveFilter('promotion', getPromotionText(promotion), promotion);
        });
        
        // Ajouter le filtre de disponibilité
        if (currentFilters.inStock) {
            addActiveFilter('stock', 'En stock', 'in-stock');
        }
    }
    
    // Fonction pour ajouter un filtre actif
    function addActiveFilter(type, text, value) {
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.dataset.type = type;
        filterTag.dataset.value = value;
        
        filterTag.textContent = text + ' ';
        
        const removeIcon = document.createElement('i');
        removeIcon.className = 'fas fa-times';
        removeIcon.onclick = function(e) {
            e.stopPropagation();
            removeFilter(type, value);
        };
        
        filterTag.appendChild(removeIcon);
        activeFiltersContainer.appendChild(filterTag);
    }
    
    // Fonction pour supprimer un filtre
    function removeFilter(type, value) {
        switch (type) {
            case 'category':
                currentFilters.categories = currentFilters.categories.filter(cat => cat !== value);
                break;
            case 'price':
                currentFilters.priceRange = {min: null, max: null};
                document.getElementById('min-price').value = '';
                document.getElementById('max-price').value = '';
                break;
            case 'promotion':
                currentFilters.promotions = currentFilters.promotions.filter(promo => promo !== value);
                break;
            case 'stock':
                currentFilters.inStock = false;
                break;
        }
        
        updateActiveFilters();
        renderProducts();
    }
    
    // Événement de soumission du formulaire de commande
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(orderForm);
            const orderData = {
                customer: {
                    name: formData.get('nom'),
                    email: formData.get('email'),
                    phone: formData.get('tel'),
                    address: formData.get('adresse')
                },
                products: [{
                    product: formData.get('produitId'),
                    name: formData.get('produit'),
                    price: parseFloat(formData.get('produitPrice')),
                    quantity: 1
                }],
                totalAmount: parseFloat(formData.get('produitPrice')),
                paymentMethod: 'paiement à la livraison',
                notes: formData.get('notes'),
                deliveryInfo: {
                    requestedDate: formData.get('deliveryDate'),
                    requestedTime: formData.get('deliveryTime')
                }
            };
            
            try {
                // Envoyer la commande à l'API
                await api.post('/orders', orderData);
                
                // Afficher un message de succès
                const orderMessage = document.getElementById('order-message');
                orderMessage.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <p>Votre commande a été enregistrée avec succès!</p>
                        <p>Nous vous contacterons bientôt pour confirmer votre commande.</p>
                    </div>
                `;
                
                // Réinitialiser le formulaire
                orderForm.reset();
                
                // Fermer le modal après 3 secondes
                setTimeout(() => {
                    orderModal.style.display = 'none';
                }, 3000);
                
            } catch (error) {
                console.error('Erreur lors de la commande:', error);
                
                // Afficher un message d'erreur
                const orderMessage = document.getElementById('order-message');
                orderMessage.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Une erreur est survenue lors de l'enregistrement de votre commande.</p>
                        <p>Veuillez réessayer plus tard ou nous contacter directement.</p>
                    </div>
                `;
            }
        });
    }
    
    // Event listeners pour les boutons de vue
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            currentView = 'grid';
            listViewBtn.classList.remove('active');
            gridViewBtn.classList.add('active');
            renderProducts();
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', function() {
            currentView = 'list';
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
            renderProducts();
        });
    }
    
    // Event listener pour le bouton de filtre
    if (filterButton && filtersPanel) {
        filterButton.addEventListener('click', function() {
            filtersPanel.classList.toggle('show');
        });
    }
    
    // Event listener pour le select de tri
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            renderProducts();
        });
    }
    
    // Event listener pour le bouton de réinitialisation des filtres
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            currentFilters = {
                categories: [],
                priceRange: {min: null, max: null},
                promotions: [],
                inStock: false
            };
            
            // Réinitialiser les champs de filtre
            document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';
            
            updateActiveFilters();
            renderProducts();
        });
    }
    
    // Event listener pour le bouton d'application des filtres
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Récupérer les catégories sélectionnées
            currentFilters.categories = [];
            document.querySelectorAll('.filter-options input[value]').forEach(checkbox => {
                if (checkbox.checked && checkbox.closest('.filter-section').querySelector('h4').textContent === 'Catégories') {
                    currentFilters.categories.push(checkbox.value);
                }
            });
            
            // Récupérer la plage de prix
            const minPrice = document.getElementById('min-price').value;
            const maxPrice = document.getElementById('max-price').value;
            currentFilters.priceRange = {
                min: minPrice ? parseFloat(minPrice) : null,
                max: maxPrice ? parseFloat(maxPrice) : null
            };
            
            // Récupérer les promotions sélectionnées
            currentFilters.promotions = [];
            document.querySelectorAll('.filter-options input[value]').forEach(checkbox => {
                if (checkbox.checked && checkbox.closest('.filter-section').querySelector('h4').textContent === 'Promotions') {
                    currentFilters.promotions.push(checkbox.value);
                }
            });
            
            // Récupérer la disponibilité
            currentFilters.inStock = false;
            document.querySelectorAll('.filter-options input[value="in-stock"]').forEach(checkbox => {
                if (checkbox.checked) {
                    currentFilters.inStock = true;
                }
            });
            
            // Mettre à jour l'affichage
            updateActiveFilters();
            renderProducts();
            
            // Masquer le panneau de filtres sur mobile
            if (window.innerWidth < 768) {
                filtersPanel.classList.remove('show');
            }
        });
    }
    
    // Event listener pour fermer les modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Fermer les modals quand on clique en dehors
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Charger les données nécessaires au démarrage
    loadCategories();
    loadProducts();
    
    // Vérifier si une catégorie est spécifiée dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentFilters.categories = [categoryParam];
        updateActiveFilters();
    }
});
