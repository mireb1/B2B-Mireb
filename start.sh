#!/bin/bash

echo "🚀 Démarrage de Mireb B2B Marketplace..."
echo ""

# Vérifier si MongoDB Docker est en cours d'exécution
if ! docker ps | grep -q mireb-mongodb; then
    echo "📦 Démarrage de MongoDB..."
    docker run -d -p 27017:27017 --name mireb-mongodb mongo:latest
    sleep 3
fi

# Démarrer le serveur backend
echo "🔧 Démarrage du serveur backend..."
cd backend
npm install > /dev/null 2>&1
npm run init-admin > /dev/null 2>&1
npm start &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 5

# Démarrer le serveur web
echo "🌐 Démarrage du serveur web..."
cd ..
npm install > /dev/null 2>&1
npm start &
WEB_PID=$!

# Attendre que le serveur web démarre
sleep 3

echo ""
echo "✅ Mireb B2B Marketplace est maintenant en ligne!"
echo ""
echo "🏠 Site principal: http://localhost:8080"
echo "🛍️  Produits: http://localhost:8080/produits.html"
echo "📞 Contact: http://localhost:8080/contact.html"
echo "⚙️  Administration: http://localhost:8080/admin.html"
echo ""
echo "👤 Connexion admin:"
echo "   Email: mirebcommercial@gmail.com"
echo "   Mot de passe: Fiacre-19"
echo ""
echo "🔧 API Backend: http://localhost:3000"
echo ""
echo "Pour arrêter les serveurs, pressez Ctrl+C"

# Attendre l'interruption utilisateur
trap "echo ''; echo '🛑 Arrêt des serveurs...'; kill $BACKEND_PID $WEB_PID; docker stop mireb-mongodb; exit" INT

# Garder le script en vie
while true; do
    sleep 1
done
