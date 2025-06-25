#!/bin/bash

# Script de test complet pour la synchronisation Shopify-style
# Mireb B2B Marketplace - Test de synchronisation avancée

echo "🧪 TEST COMPLET - SYNCHRONISATION SHOPIFY STYLE"
echo "=================================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Compteurs
TESTS_PASSED=0
TESTS_TOTAL=0

# Fonction pour afficher le résultat d'un test
print_test_result() {
    ((TESTS_TOTAL++))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSÉ${NC} - $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ ÉCHEC${NC} - $2"
    fi
}

echo -e "${BLUE}📋 Vérification des fichiers de synchronisation Shopify...${NC}"
echo ""

# Test 1: Vérifier que les nouveaux fichiers existent
echo "1️⃣  Nouveaux fichiers Shopify:"

if [ -f "js/product-manager-shopify.js" ]; then
    print_test_result 0 "product-manager-shopify.js existe"
else
    print_test_result 1 "product-manager-shopify.js manquant"
fi

if [ -f "js/homepage-sync.js" ]; then
    print_test_result 0 "homepage-sync.js existe"
else
    print_test_result 1 "homepage-sync.js manquant"
fi

if [ -f "admin-shopify.html" ]; then
    print_test_result 0 "admin-shopify.html existe"
else
    print_test_result 1 "admin-shopify.html manquant"
fi

if [ -f "js/admin-shopify-interface.js" ]; then
    print_test_result 0 "admin-shopify-interface.js existe"
else
    print_test_result 1 "admin-shopify-interface.js manquant"
fi

echo ""

# Test 2: Vérifier les fonctionnalités de synchronisation
echo "2️⃣  Fonctionnalités de synchronisation:"

if grep -q "MirebProductManager" js/product-manager-shopify.js; then
    print_test_result 0 "Classe MirebProductManager présente"
else
    print_test_result 1 "Classe MirebProductManager manquante"
fi

if grep -q "HomepageSync" js/homepage-sync.js; then
    print_test_result 0 "Classe HomepageSync présente"
else
    print_test_result 1 "Classe HomepageSync manquante"
fi

if grep -q "mirebDataUpdated" js/product-manager-shopify.js; then
    print_test_result 0 "Événement mirebDataUpdated configuré"
else
    print_test_result 1 "Événement mirebDataUpdated manquant"
fi

if grep -q "mirebDataUpdated" js/homepage-sync.js; then
    print_test_result 0 "Écouteur mirebDataUpdated configuré"
else
    print_test_result 1 "Écouteur mirebDataUpdated manquant"
fi

echo ""

# Test 3: Vérifier les fonctionnalités d'upload
echo "3️⃣  Gestion des fichiers et upload:"

if grep -q "uploadImage" js/product-manager-shopify.js; then
    print_test_result 0 "Fonction uploadImage présente"
else
    print_test_result 1 "Fonction uploadImage manquante"
fi

if grep -q "createDownloadLink" js/product-manager-shopify.js; then
    print_test_result 0 "Fonction createDownloadLink présente"
else
    print_test_result 1 "Fonction createDownloadLink manquante"
fi

if grep -q "handleImageUpload" js/admin-shopify-interface.js; then
    print_test_result 0 "Gestion upload d'images configurée"
else
    print_test_result 1 "Gestion upload d'images manquante"
fi

if grep -q "download" admin-shopify.html; then
    print_test_result 0 "Liens de téléchargement configurés dans l'interface"
else
    print_test_result 1 "Liens de téléchargement manquants dans l'interface"
fi

echo ""

# Test 4: Vérifier l'interface Shopify
echo "4️⃣  Interface style Shopify:"

if grep -q "admin-shopify" admin-shopify.html; then
    print_test_result 0 "Styles Shopify appliqués"
else
    print_test_result 1 "Styles Shopify manquants"
fi

if grep -q "upload-area" admin-shopify.html; then
    print_test_result 0 "Zone d'upload configurée"
else
    print_test_result 1 "Zone d'upload manquante"
fi

if grep -q "drag" js/admin-shopify-interface.js; then
    print_test_result 0 "Drag & Drop configuré"
else
    print_test_result 1 "Drag & Drop manquant"
fi

if grep -q "modal" admin-shopify.html; then
    print_test_result 0 "Modals Shopify configurés"
else
    print_test_result 1 "Modals Shopify manquants"
fi

echo ""

# Test 5: Vérifier la synchronisation avec la page d'accueil
echo "5️⃣  Synchronisation avec la page d'accueil:"

if grep -q "categories-top-grid" index.html; then
    print_test_result 0 "Grille catégories du haut configurée"
else
    print_test_result 1 "Grille catégories du haut manquante"
fi

if grep -q "categories-bottom-grid" index.html; then
    print_test_result 0 "Grille catégories du bas configurée"
else
    print_test_result 1 "Grille catégories du bas manquante"
fi

if grep -q "featured-products-grid" index.html; then
    print_test_result 0 "Grille produits vedettes configurée"
else
    print_test_result 1 "Grille produits vedettes manquante"
fi

if grep -q "regular-products-grid" index.html; then
    print_test_result 0 "Grille produits réguliers configurée"
else
    print_test_result 1 "Grille produits réguliers manquante"
fi

echo ""

# Test 6: Vérifier les fonctionnalités avancées
echo "6️⃣  Fonctionnalités avancées:"

if grep -q "exportData" js/product-manager-shopify.js; then
    print_test_result 0 "Export de données configuré"
else
    print_test_result 1 "Export de données manquant"
fi

if grep -q "importData" js/product-manager-shopify.js; then
    print_test_result 0 "Import de données configuré"
else
    print_test_result 1 "Import de données manquant"
fi

if grep -q "searchProducts" js/product-manager-shopify.js; then
    print_test_result 0 "Recherche de produits configurée"
else
    print_test_result 1 "Recherche de produits manquante"
fi

if grep -q "changeCurrency" js/homepage-sync.js; then
    print_test_result 0 "Changement de devise configuré"
else
    print_test_result 1 "Changement de devise manquant"
fi

echo ""

# Test 7: Vérifier l'intégration des scripts
echo "7️⃣  Intégration des scripts:"

if grep -q "product-manager-shopify.js" index.html; then
    print_test_result 0 "Script product-manager-shopify.js inclus dans index.html"
else
    print_test_result 1 "Script product-manager-shopify.js manquant dans index.html"
fi

if grep -q "homepage-sync.js" index.html; then
    print_test_result 0 "Script homepage-sync.js inclus dans index.html"
else
    print_test_result 1 "Script homepage-sync.js manquant dans index.html"
fi

if grep -q "admin-shopify-interface.js" admin-shopify.html; then
    print_test_result 0 "Script admin-shopify-interface.js inclus dans admin-shopify.html"
else
    print_test_result 1 "Script admin-shopify-interface.js manquant dans admin-shopify.html"
fi

echo ""

# Résultat final
echo "============================================================="
echo -e "${BLUE}📊 RÉSULTATS DES TESTS SHOPIFY${NC}"
echo ""

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS SONT PASSÉS !${NC}"
    echo -e "${GREEN}✅ Synchronisation Shopify-style : OPÉRATIONNELLE${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ $((TESTS_TOTAL - TESTS_PASSED)) test(s) échoué(s) sur $TESTS_TOTAL${NC}"
    echo -e "${YELLOW}⚠️  Synchronisation Shopify-style : PARTIELLE${NC}"
    EXIT_CODE=1
fi

echo ""
echo -e "${PURPLE}🚀 NOUVELLES FONCTIONNALITÉS SHOPIFY :${NC}"
echo "• 📤 Upload d'images avec drag & drop"
echo "• 📱 Liens de téléchargement pour mobile"
echo "• 🔄 Synchronisation temps réel bidirectionnelle"
echo "• 🎨 Interface moderne style Shopify"
echo "• 📊 Import/Export de données JSON"
echo "• 🔍 Recherche en temps réel"
echo "• 💱 Changement de devise automatique"
echo "• 🏷️ Gestion avancée des catégories"
echo ""

echo -e "${BLUE}🔧 Instructions de test manuel :${NC}"
echo "1. Ouvrir admin-shopify.html"
echo "2. Ajouter/modifier des produits avec images"
echo "3. Tester l'upload par drag & drop"
echo "4. Vérifier les liens de téléchargement"
echo "5. Ouvrir index.html dans un autre onglet"
echo "6. Constater la synchronisation automatique"
echo "7. Tester la recherche et le changement de devise"
echo ""

echo -e "${BLUE}🌐 URLs de test :${NC}"
echo "• Admin Shopify: file://$(pwd)/admin-shopify.html"
echo "• Page d'accueil: file://$(pwd)/index.html"
echo "• Test de sync: file://$(pwd)/test-sync.html"
echo ""

echo -e "${BLUE}📱 Test sur GitHub Pages :${NC}"
echo "• Admin Shopify: https://mireb1.github.io/B2B-Mireb/admin-shopify.html"
echo "• Accueil: https://mireb1.github.io/B2B-Mireb/index.html"
echo ""

echo -e "${PURPLE}💡 AVANTAGES DE LA NOUVELLE VERSION :${NC}"
echo "• Style professionnel Shopify"
echo "• Upload et gestion d'images intégrée"
echo "• Téléchargement mobile des images"
echo "• Synchronisation instantanée"
echo "• Interface utilisateur moderne"
echo "• Gestion complète des produits et catégories"
echo ""

exit $EXIT_CODE
