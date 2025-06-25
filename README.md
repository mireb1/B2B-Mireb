# 🏢 B2B-Mireb - Plateforme E-commerce B2B

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://mireb1.github.io/B2B-Mireb/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/mireb1/B2B-Mireb)

## 🌐 **Accès en ligne**
🚀 **Site web** : [https://mireb1.github.io/B2B-Mireb/](https://mireb1.github.io/B2B-Mireb/)

## 📋 Description
Plateforme e-commerce B2B complète pour la gestion des commandes professionnelles avec interface d'administration moderne et élégante.

## 🚀 Fonctionnalités
- ✅ Gestion des produits et catégories
- ✅ Système de commandes B2B
- ✅ Interface d'administration
- ✅ Authentification sécurisée
- ✅ Gestion des clients
- ✅ Système de messages
- ✅ Tableau de bord analytics

## 🛠️ Technologies
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB Atlas
- **Authentification**: JWT

## 📦 Installation

### Prérequis
- Node.js (v14+)
- MongoDB Atlas account
- Git

### Configuration
1. Cloner le projet
```bash
git clone https://github.com/VOTRE-USERNAME/b2b-mireb.git
cd b2b-mireb
```

2. Installer les dépendances
```bash
cd backend
npm install
```

3. Configurer les variables d'environnement
Créer un fichier `.env` dans le dossier `backend/` :
```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/b2b-mireb
JWT_SECRET=votre-secret-jwt
NODE_ENV=development
```

4. Initialiser l'administrateur
```bash
node initAdmin.js
```

5. Démarrer les serveurs
```bash
# Backend (Terminal 1)
npm start

# Frontend (Terminal 2)
cd ..
python3 -m http.server 3000
```

## 🌐 Accès
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin**: http://localhost:3000/admin.html

## 📁 Structure du projet
```
B2B-Mireb/
├── backend/                 # API Node.js
│   ├── controllers/        # Logique métier
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── middleware/        # Authentification
│   └── server.js          # Serveur principal
├── js/                    # Scripts frontend
├── assets/               # Images et ressources
├── *.html               # Pages web
└── *.css                # Styles
```

## 🔐 Sécurité
- Authentification JWT
- Middleware de protection des routes
- Validation des données
- Protection CORS

## 👥 Utilisation
1. Accéder à l'interface d'administration
2. Gérer les produits et catégories
3. Traiter les commandes clients
4. Analyser les performances

## 📞 Contact
- Email: mirebcommercial@gmail.com
- Projet: B2B E-commerce Platform

## 📄 Licence
MIT License

Une plateforme B2B moderne pour connecter les entreprises et faciliter les échanges commerciaux.

## Fonctionnalités

- Catalogue de produits B2B
- Interface d'administration complète
- Gestion des commandes et paiement à la réception
- Formulaire de contact
- Tableau de bord avec statistiques et graphiques
- **NOUVEAU**: Système de base de données MongoDB pour un stockage durable des données

## Accès administration

Pour accéder à l'interface d'administration:

- URL: `/admin.html`
- Email: mirebcommercial@gmail.com
- Mot de passe: Fiacre-19

## Structure du projet

Le projet comporte deux parties principales:

### Frontend
- HTML pour la structure
- CSS pour le style
- JavaScript pour les interactions client

### Backend (NOUVEAU)
- Node.js avec Express pour l'API REST
- MongoDB pour le stockage durable des données
- JWT pour l'authentification sécurisée
- Architecture MVC (Modèles, Contrôleurs, Routes)

## Configuration et installation

### Prérequis
- Node.js (v14+)
- MongoDB (v4+)

### Installation
1. Cloner le dépôt
   ```bash
   git clone https://github.com/mireb1/B2B-Mireb.git
   cd B2B-Mireb
   ```

2. Installer les dépendances du backend
   ```bash
   cd backend
   npm install
   ```

3. Configurer les variables d'environnement
   - Créer un fichier `.env` dans le dossier `backend` (un exemple est fourni dans `.env.example`)
   - Définir les variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`

4. Initialiser le compte administrateur
   ```bash
   npm run init-admin
   ```

5. Démarrer le serveur
   ```bash
   npm run dev
   ```

## Déploiement

### Frontend
Le site frontend est déployé sur GitHub Pages à l'adresse: https://mireb1.github.io/B2B-Mireb/

### Backend
Pour déployer le backend sur un serveur:
1. Configurer les variables d'environnement pour la production
2. Exécuter `npm start` pour démarrer le serveur
3. Options de déploiement recommandées:
   - Heroku
   - Render
   - Railway
   - VPS avec PM2

## Documentation de l'API

L'API REST expose les endpoints suivants:

- `/api/auth` - Authentification
- `/api/products` - Gestion des produits
- `/api/orders` - Gestion des commandes
- `/api/customers` - Gestion des clients
- `/api/messages` - Gestion des messages
- `/api/dashboard` - Statistiques et activités

## Migration depuis localStorage

La version précédente utilisait localStorage pour stocker les données. Le nouveau système de base de données permet:
- Un stockage permanent et sécurisé des données
- La synchronisation entre plusieurs appareils
- Une meilleure performance pour les grandes quantités de données
- Des sauvegardes automatisées
- Un accès API pour intégrations tierces

## License

Copyright © 2025 Mireb B2B Marketplace. Tous droits réservés.Force cache clear - Tue Jun 24 14:03:11 UTC 2025
