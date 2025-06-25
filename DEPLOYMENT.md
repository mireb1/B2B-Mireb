# 🚀 Mireb B2B Marketplace

## Démarrage rapide

### Option 1 : Script automatique (Recommandé)
```bash
./start.sh
```

### Option 2 : Tâche VSCode
1. Ouvrir la palette de commandes (Ctrl+Shift+P)
2. Taper "Tasks: Run Task"
3. Sélectionner "Démarrer Mireb B2B"

### Option 3 : Démarrage manuel

1. **Démarrer MongoDB avec Docker:**
```bash
docker run -d -p 27017:27017 --name mireb-mongodb mongo:latest
```

2. **Démarrer le serveur backend:**
```bash
cd backend
npm install
npm run init-admin
npm start
```

3. **Démarrer le serveur web (dans un nouveau terminal):**
```bash
npm install
npm start
```

## 🌐 Accès au site

- **Site principal:** http://localhost:8080
- **Produits:** http://localhost:8080/produits.html
- **Contact:** http://localhost:8080/contact.html
- **Administration:** http://localhost:8080/admin.html

## 👤 Connexion administrateur

- **Email:** mirebcommercial@gmail.com
- **Mot de passe:** Fiacre-19

## 🔧 API Backend

L'API REST est accessible sur http://localhost:3000

### Endpoints principaux:
- `GET /api/products` - Liste des produits
- `POST /api/orders` - Créer une commande
- `POST /api/messages` - Envoyer un message
- `POST /api/auth/login` - Connexion admin

## 🛠️ Technologies utilisées

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Base de données:** MongoDB
- **Conteneurisation:** Docker (pour MongoDB)

## 📱 Fonctionnalités

### Frontend
- ✅ Design responsive et moderne
- ✅ Interface d'administration complète
- ✅ Système de commandes avec paiement à la livraison
- ✅ Formulaire de contact professionnel
- ✅ Catalogue de produits interactif

### Backend
- ✅ API REST complète
- ✅ Authentification JWT
- ✅ Gestion des utilisateurs et administrateurs
- ✅ CRUD pour produits, commandes, messages
- ✅ Validation des données

## 🚫 Arrêt des serveurs

Pour arrêter tous les services:
```bash
# Si vous avez utilisé le script start.sh
Ctrl+C dans le terminal

# Ou manuellement
docker stop mireb-mongodb
pkill -f "node"
```

## 📋 Notes importantes

- MongoDB fonctionne via Docker sur le port 27017
- Le serveur web fonctionne sur le port 8080
- L'API backend fonctionne sur le port 3000
- Tous les ports peuvent être modifiés dans les fichiers de configuration

## 🐛 Dépannage

### MongoDB ne démarre pas
```bash
docker stop mireb-mongodb
docker rm mireb-mongodb
docker run -d -p 27017:27017 --name mireb-mongodb mongo:latest
```

### Port déjà utilisé
```bash
# Trouver et arrêter le processus
lsof -ti:8080 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

**Développé avec ❤️ pour Mireb Commercial**
