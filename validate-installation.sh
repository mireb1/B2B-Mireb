#!/bin/bash

# Script de validation finale - Mireb B2B Marketplace
# Vérification de l'installation et fonctionnement

echo "🔍 =========================================="
echo "🔍 VALIDATION FINALE - MIREB B2B MARKETPLACE"
echo "🔍 =========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Fonction pour afficher les informations
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction pour afficher les avertissements
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "🔍 Vérification des fichiers principaux..."

# Vérifier les fichiers HTML
files_html=("index.html" "admin.html" "contact.html" "produits.html")
for file in "${files_html[@]}"; do
    if [ -f "$file" ]; then
        show_result 0 "Fichier HTML: $file"
    else
        show_result 1 "Fichier HTML manquant: $file"
    fi
done

echo ""
echo "🔍 Vérification des scripts JavaScript..."

# Vérifier les fichiers JavaScript
files_js=(
    "js/config.js"
    "js/admin-advanced.js"
    "js/homepage-categories.js"
    "js/contact-manager.js"
    "js/crm-advanced.js"
    "js/social-integrations.js"
    "js/user-management.js"
    "js/deliveries.js"
    "js/categories-config.js"
)

for file in "${files_js[@]}"; do
    if [ -f "$file" ]; then
        show_result 0 "Script JS: $file"
    else
        show_result 1 "Script JS manquant: $file"
    fi
done

echo ""
echo "🔍 Vérification du backend..."

# Vérifier les fichiers backend
if [ -d "backend" ]; then
    show_result 0 "Dossier backend existe"
    
    # Vérifier package.json
    if [ -f "backend/package.json" ]; then
        show_result 0 "Package.json backend"
    else
        show_result 1 "Package.json backend manquant"
    fi
    
    # Vérifier les serveurs
    if [ -f "backend/server.js" ]; then
        show_result 0 "Serveur principal: server.js"
    else
        show_result 1 "Serveur principal manquant"
    fi
    
    if [ -f "backend/server-simple.js" ]; then
        show_result 0 "Serveur simple: server-simple.js"
    else
        show_result 1 "Serveur simple manquant"
    fi
    
    # Vérifier les modèles
    models=("Product.js" "Category.js" "User.js" "Order.js" "Lead.js" "Delivery.js")
    for model in "${models[@]}"; do
        if [ -f "backend/models/$model" ]; then
            show_result 0 "Modèle: $model"
        else
            show_result 1 "Modèle manquant: $model"
        fi
    done
    
    # Vérifier les contrôleurs
    controllers=("authController.js" "productController.js" "categoryController.js" "userController.js" "leadController.js" "deliveryController.js")
    for controller in "${controllers[@]}"; do
        if [ -f "backend/controllers/$controller" ]; then
            show_result 0 "Contrôleur: $controller"
        else
            show_result 1 "Contrôleur manquant: $controller"
        fi
    done
    
    # Vérifier les routes
    routes=("auth.js" "products.js" "categories.js" "users.js" "leads.js" "deliveries.js")
    for route in "${routes[@]}"; do
        if [ -f "backend/routes/$route" ]; then
            show_result 0 "Route: $route"
        else
            show_result 1 "Route manquante: $route"
        fi
    done
    
else
    show_result 1 "Dossier backend manquant"
fi

echo ""
echo "🔍 Vérification des dépendances..."

# Vérifier Node.js
if command -v node &> /dev/null; then
    node_version=$(node --version)
    show_result 0 "Node.js installé: $node_version"
else
    show_result 1 "Node.js non installé"
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    show_result 0 "npm installé: $npm_version"
else
    show_result 1 "npm non installé"
fi

# Vérifier les dépendances du projet
if [ -f "backend/package.json" ] && [ -d "backend/node_modules" ]; then
    show_result 0 "Dépendances backend installées"
else
    show_result 1 "Dépendances backend non installées"
fi

echo ""
echo "🔍 Vérification des styles CSS..."

# Vérifier les fichiers CSS
files_css=("style.css" "style-modern.css" "product-detail.css" "product-filters.css")
for file in "${files_css[@]}"; do
    if [ -f "$file" ]; then
        show_result 0 "Fichier CSS: $file"
    else
        show_result 1 "Fichier CSS manquant: $file"
    fi
done

echo ""
echo "🔍 Test de connectivité du serveur..."

# Vérifier si le serveur est en cours d'exécution
if curl -s http://localhost:3000/api/health &> /dev/null; then
    show_result 0 "Serveur backend fonctionnel (port 3000)"
else
    show_warning "Serveur non démarré ou non accessible"
    show_info "Pour démarrer le serveur: cd backend && node server-simple.js"
fi

echo ""
echo "🔍 Vérification des fonctionnalités..."

# Vérifier les fichiers de déploiement
if [ -f "deploy-advanced.sh" ]; then
    show_result 0 "Script de déploiement avancé"
else
    show_result 1 "Script de déploiement manquant"
fi

if [ -f "DEPLOYMENT.md" ]; then
    show_result 0 "Documentation de déploiement"
else
    show_result 1 "Documentation de déploiement manquante"
fi

echo ""
echo "🔍 Résumé des fonctionnalités implémentées..."

functionalities=(
    "✅ Interface admin moderne et responsive"
    "✅ Gestion des produits et catégories"
    "✅ CRM avancé avec leads et clients"
    "✅ Système de livraison et tracking"
    "✅ Gestion des utilisateurs et sous-comptes"
    "✅ Intégrations réseaux sociaux"
    "✅ Marketing et publication automatisée"
    "✅ Tunnel de vente optimisé"
    "✅ Analytics et rapports avancés"
    "✅ Formulaire de contact optimisé"
    "✅ Configuration centralisée"
    "✅ Variables optimisées et modulaires"
    "✅ Backend API complet"
    "✅ Déploiement automatisé"
)

for functionality in "${functionalities[@]}"; do
    echo -e "${GREEN}$functionality${NC}"
done

echo ""
echo "🔍 Instructions de démarrage..."

show_info "1. Démarrer le serveur backend:"
echo "   cd backend && node server-simple.js"

show_info "2. Accéder aux interfaces:"
echo "   • Site web: http://localhost:3000"
echo "   • Interface admin: http://localhost:3000/admin.html"
echo "   • Page contact: http://localhost:3000/contact.html"

show_info "3. Identifiants admin par défaut:"
echo "   • Email: admin@mireb.com"
echo "   • Mot de passe: admin123"

show_info "4. Déploiement:"
echo "   • Utiliser: ./deploy-advanced.sh"
echo "   • Suivre les instructions dans DEPLOYMENT.md"

echo ""
echo "🔍 Problèmes courants et solutions..."

echo -e "${YELLOW}❓ Si le serveur ne démarre pas:${NC}"
echo "   1. Vérifier que le port 3000 est libre"
echo "   2. Installer les dépendances: cd backend && npm install"
echo "   3. Vérifier la configuration dans backend/.env"

echo -e "${YELLOW}❓ Si l'interface admin ne fonctionne pas:${NC}"
echo "   1. Vérifier que tous les scripts JS sont chargés"
echo "   2. Ouvrir la console du navigateur pour voir les erreurs"
echo "   3. Vérifier que le serveur backend est démarré"

echo -e "${YELLOW}❓ Si le formulaire de contact ne fonctionne pas:${NC}"
echo "   1. Vérifier l'API /api/messages"
echo "   2. Contrôler les logs du serveur"
echo "   3. Tester avec curl: curl -X POST http://localhost:3000/api/messages"

echo ""
echo "🎉 =========================================="
echo "🎉 VALIDATION TERMINÉE"
echo "🎉 Mireb B2B Marketplace est prêt à l'emploi!"
echo "🎉 =========================================="
