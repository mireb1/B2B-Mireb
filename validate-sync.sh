#!/bin/bash

# Script de validation de la synchronisation Admin ↔ Page d'accueil
# Mireb B2B Marketplace - Test de synchronisation

echo "🧪 VALIDATION DE LA SYNCHRONISATION ADMIN ↔ PAGE D'ACCUEIL"
echo "============================================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo -e "${BLUE}📋 Vérification des fichiers de synchronisation...${NC}"
echo ""

# Test 1: Vérifier que les fichiers existent
echo "1️⃣  Fichiers requis:"
if [ -f "js/admin-advanced.js" ]; then
    print_test_result 0 "admin-advanced.js existe"
else
    print_test_result 1 "admin-advanced.js manquant"
fi

if [ -f "js/homepage-categories.js" ]; then
    print_test_result 0 "homepage-categories.js existe"
else
    print_test_result 1 "homepage-categories.js manquant"
fi

if [ -f "test-sync.html" ]; then
    print_test_result 0 "test-sync.html existe"
else
    print_test_result 1 "test-sync.html manquant"
fi

echo ""

# Test 2: Vérifier la présence des fonctions de synchronisation
echo "2️⃣  Fonctions de synchronisation:"

if grep -q "syncWithHomepage" js/admin-advanced.js; then
    print_test_result 0 "Fonction syncWithHomepage présente dans admin-advanced.js"
else
    print_test_result 1 "Fonction syncWithHomepage manquante dans admin-advanced.js"
fi

if grep -q "setupAdminSync" js/homepage-categories.js; then
    print_test_result 0 "Fonction setupAdminSync présente dans homepage-categories.js"
else
    print_test_result 1 "Fonction setupAdminSync manquante dans homepage-categories.js"
fi

if grep -q "adminDataUpdated" js/admin-advanced.js; then
    print_test_result 0 "Événement adminDataUpdated configuré dans admin-advanced.js"
else
    print_test_result 1 "Événement adminDataUpdated manquant dans admin-advanced.js"
fi

if grep -q "adminDataUpdated" js/homepage-categories.js; then
    print_test_result 0 "Écouteur adminDataUpdated configuré dans homepage-categories.js"
else
    print_test_result 1 "Écouteur adminDataUpdated manquant dans homepage-categories.js"
fi

echo ""

# Test 3: Vérifier les appels localStorage
echo "3️⃣  Intégration localStorage:"

if grep -q "mireb_categories" js/admin-advanced.js; then
    print_test_result 0 "Sauvegarde mireb_categories dans admin-advanced.js"
else
    print_test_result 1 "Sauvegarde mireb_categories manquante dans admin-advanced.js"
fi

if grep -q "mireb_products" js/admin-advanced.js; then
    print_test_result 0 "Sauvegarde mireb_products dans admin-advanced.js"
else
    print_test_result 1 "Sauvegarde mireb_products manquante dans admin-advanced.js"
fi

if grep -q "mireb_categories" js/homepage-categories.js; then
    print_test_result 0 "Lecture mireb_categories dans homepage-categories.js"
else
    print_test_result 1 "Lecture mireb_categories manquante dans homepage-categories.js"
fi

if grep -q "mireb_products" js/homepage-categories.js; then
    print_test_result 0 "Lecture mireb_products dans homepage-categories.js"
else
    print_test_result 1 "Lecture mireb_products manquante dans homepage-categories.js"
fi

echo ""

# Test 4: Vérifier les notifications CSS
echo "4️⃣  Styles de notification:"

if grep -q "update-notification" style-alibaba.css; then
    print_test_result 0 "Styles de notification présents dans style-alibaba.css"
else
    print_test_result 1 "Styles de notification manquants dans style-alibaba.css"
fi

if grep -q "slideInRight" style-alibaba.css; then
    print_test_result 0 "Animation slideInRight présente dans style-alibaba.css"
else
    print_test_result 1 "Animation slideInRight manquante dans style-alibaba.css"
fi

echo ""

# Test 5: Vérifier la structure des données
echo "5️⃣  Structure des données:"

if grep -q "categories.*=.*\[" js/admin-advanced.js; then
    print_test_result 0 "Données de catégories initialisées dans admin-advanced.js"
else
    print_test_result 1 "Données de catégories non initialisées dans admin-advanced.js"
fi

if grep -q "products.*=.*\[" js/admin-advanced.js; then
    print_test_result 0 "Données de produits initialisées dans admin-advanced.js"
else
    print_test_result 1 "Données de produits non initialisées dans admin-advanced.js"
fi

echo ""

# Test 6: Vérifier la gestion d'erreurs
echo "6️⃣  Gestion d'erreurs:"

if grep -q "try.*catch" js/admin-advanced.js; then
    print_test_result 0 "Gestion d'erreurs présente dans admin-advanced.js"
else
    print_test_result 1 "Gestion d'erreurs manquante dans admin-advanced.js"
fi

if grep -q "try.*catch" js/homepage-categories.js; then
    print_test_result 0 "Gestion d'erreurs présente dans homepage-categories.js"
else
    print_test_result 1 "Gestion d'erreurs manquante dans homepage-categories.js"
fi

echo ""

# Résultat final
echo "============================================================="
echo -e "${BLUE}📊 RÉSULTATS DES TESTS${NC}"
echo ""

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS SONT PASSÉS !${NC}"
    echo -e "${GREEN}✅ Synchronisation Admin ↔ Page d'accueil : OPÉRATIONNELLE${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ $((TESTS_TOTAL - TESTS_PASSED)) test(s) échoué(s) sur $TESTS_TOTAL${NC}"
    echo -e "${YELLOW}⚠️  Synchronisation Admin ↔ Page d'accueil : PARTIELLE${NC}"
    EXIT_CODE=1
fi

echo ""
echo -e "${BLUE}🔧 Instructions de test manuel :${NC}"
echo "1. Ouvrir admin.html et se connecter"
echo "2. Ajouter/modifier une catégorie ou un produit"
echo "3. Ouvrir index.html dans un autre onglet"
echo "4. Vérifier que les changements apparaissent automatiquement"
echo "5. Utiliser test-sync.html pour des tests détaillés"
echo ""

echo -e "${BLUE}🌐 URLs de test :${NC}"
echo "• Interface Admin: file://$(pwd)/admin.html"
echo "• Page d'accueil: file://$(pwd)/index.html"
echo "• Test de sync: file://$(pwd)/test-sync.html"
echo ""

echo -e "${BLUE}📱 Test sur GitHub Pages :${NC}"
echo "• Admin: https://mireb1.github.io/B2B-Mireb/admin.html"
echo "• Accueil: https://mireb1.github.io/B2B-Mireb/index.html"
echo "• Test: https://mireb1.github.io/B2B-Mireb/test-sync.html"
echo ""

exit $EXIT_CODE
