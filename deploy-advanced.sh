#!/bin/bash

# Script de déploiement automatique pour Mireb B2B Marketplace
# Fonctionnalités: Git, GitHub Pages, Docker, Backend

echo "🚀 Démarrage du déploiement Mireb B2B Marketplace"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis validés"
}

# Installer les dépendances
install_dependencies() {
    log_info "Installation des dépendances backend..."
    cd backend
    npm install
    cd ..
    log_success "Dépendances installées"
}

# Tests de base
run_tests() {
    log_info "Exécution des tests de base..."
    
    # Test de syntaxe JavaScript
    if command -v node &> /dev/null; then
        find . -name "*.js" -not -path "./node_modules/*" -not -path "./backend/node_modules/*" | while read file; do
            if ! node -c "$file" 2>/dev/null; then
                log_error "Erreur de syntaxe dans $file"
                exit 1
            fi
        done
    fi
    
    log_success "Tests de base terminés"
}

# Configuration Git
setup_git() {
    log_info "Configuration Git..."
    
    # Initialiser le repo si nécessaire
    if [ ! -d ".git" ]; then
        git init
        log_success "Repository Git initialisé"
    fi
    
    # Configurer .gitignore
    cat > .gitignore << EOF
# Dépendances
node_modules/
backend/node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Variables d'environnement
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Fichiers temporaires
*.tmp
*.temp
.DS_Store
Thumbs.db

# Builds
dist/
build/

# Base de données
*.db
*.sqlite

# Backups
backups/
*.backup

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
    
    log_success "Git configuré"
}

# Déploiement GitHub
deploy_github() {
    log_info "Déploiement sur GitHub..."
    
    # Demander l'URL du repository
    read -p "Entrez l'URL du repository GitHub (ou appuyez sur Entrée pour ignorer): " repo_url
    
    if [ -z "$repo_url" ]; then
        log_warning "Déploiement GitHub ignoré"
        return
    fi
    
    # Ajouter origin si nécessaire
    if ! git remote | grep -q "origin"; then
        git remote add origin "$repo_url"
        log_success "Remote origin ajouté"
    fi
    
    # Commit et push
    git add .
    git commit -m "🚀 Mise à jour automatique - $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push sur main
    git push -u origin main
    log_success "Code déployé sur GitHub"
    
    # Configuration GitHub Pages
    setup_github_pages
}

# Configuration GitHub Pages
setup_github_pages() {
    log_info "Configuration GitHub Pages..."
    
    # Créer le workflow GitHub Actions
    mkdir -p .github/workflows
    
    cat > .github/workflows/deploy.yml << EOF
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend
        npm install
        cd ..
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        exclude_assets: 'backend/node_modules/**'
EOF
    
    log_success "GitHub Pages configuré"
}

# Déploiement Docker
deploy_docker() {
    log_info "Préparation du déploiement Docker..."
    
    # Dockerfile pour le backend
    cat > backend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
EOF
    
    # docker-compose.yml
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mireb-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - mireb-network

  backend:
    build: ./backend
    container_name: mireb-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/mireb_db?authSource=admin
      JWT_SECRET: your-secret-key-here
    depends_on:
      - mongodb
    networks:
      - mireb-network

  frontend:
    image: nginx:alpine
    container_name: mireb-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
    networks:
      - mireb-network

volumes:
  mongodb_data:

networks:
  mireb-network:
    driver: bridge
EOF
    
    # Configuration Nginx
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files \$uri \$uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://backend:5000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF
    
    log_success "Configuration Docker créée"
    
    # Demander si on veut lancer Docker
    read -p "Voulez-vous démarrer les services Docker ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose up -d
        log_success "Services Docker démarrés"
    fi
}

# Mise à jour du site
update_site() {
    log_info "Mise à jour du site..."
    
    # Mettre à jour les timestamps
    find . -name "*.html" -exec sed -i "s/<!-- Last updated: .* -->/<!-- Last updated: $(date) -->/g" {} \;
    
    # Générer un fichier de version
    cat > version.json << EOF
{
    "version": "1.0.0",
    "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "features": [
        "Interface Admin Complète",
        "CRM Avancé",
        "Gestion Livraisons",
        "Marketing & Réseaux Sociaux",
        "Gestion Utilisateurs",
        "Tunnel de Vente",
        "Analytics Avancées"
    ]
}
EOF
    
    log_success "Site mis à jour"
}

# Génération de la documentation
generate_docs() {
    log_info "Génération de la documentation..."
    
    # Mise à jour du README
    cat > README.md << EOF
# 🛍️ Mireb B2B Marketplace

Plateforme e-commerce B2B complète avec interface admin avancée.

## ✨ Fonctionnalités

- **Interface Admin Complète** : Gestion des produits, catégories, commandes
- **CRM Avancé** : Gestion clients avec appels, SMS, WhatsApp
- **Gestion Livraisons** : Suivi complet et optimisation des tournées
- **Marketing** : Intégration Facebook, Instagram, tunnels de vente
- **Gestion Utilisateurs** : Système de rôles et sous-comptes
- **Analytics** : Tableaux de bord détaillés
- **Responsive** : Interface moderne adaptée mobile

## 🚀 Installation

\`\`\`bash
# Cloner le repository
git clone [URL_DU_REPO]
cd B2B-Mireb

# Installer les dépendances
cd backend
npm install
cd ..

# Démarrer MongoDB
docker run -d -p 27017:27017 --name mongodb mongo

# Démarrer le backend
cd backend
npm start

# Démarrer le frontend
python3 -m http.server 8080
\`\`\`

## 🐳 Docker

\`\`\`bash
# Démarrer tous les services
docker-compose up -d

# Arrêter les services
docker-compose down
\`\`\`

## 📚 Documentation

- **Admin** : \`admin.html\` - Interface d'administration
- **API** : \`/api/\` - Endpoints REST
- **Docs** : \`DEPLOYMENT.md\` - Guide de déploiement

## 🔧 Configuration

Fichier \`.env\` dans le dossier \`backend/\`:

\`\`\`
MONGODB_URI=mongodb://localhost:27017/mireb_db
JWT_SECRET=your-secret-key
NODE_ENV=development
\`\`\`

## 👥 Équipe

Développé par l'équipe Mireb Commercial.

## 📄 Licence

MIT License - Voir le fichier LICENSE.

---

**Dernière mise à jour:** $(date)
EOF
    
    log_success "Documentation générée"
}

# Nettoyage
cleanup() {
    log_info "Nettoyage des fichiers temporaires..."
    
    # Supprimer les fichiers temporaires
    find . -name "*.tmp" -delete
    find . -name "*.temp" -delete
    find . -name ".DS_Store" -delete
    
    log_success "Nettoyage terminé"
}

# Fonction principale
main() {
    echo "🚀 Déploiement Mireb B2B Marketplace"
    echo "===================================="
    
    # Vérifier les prérequis
    check_prerequisites
    
    # Installer les dépendances
    install_dependencies
    
    # Exécuter les tests
    run_tests
    
    # Configurer Git
    setup_git
    
    # Mettre à jour le site
    update_site
    
    # Générer la documentation
    generate_docs
    
    # Nettoyer
    cleanup
    
    # Menu de déploiement
    echo ""
    echo "🎯 Options de déploiement:"
    echo "1) GitHub + GitHub Pages"
    echo "2) Docker (local)"
    echo "3) GitHub + Docker"
    echo "4) Ignorer le déploiement"
    echo ""
    read -p "Choisissez une option (1-4): " -n 1 -r
    echo ""
    
    case $REPLY in
        1)
            deploy_github
            ;;
        2)
            deploy_docker
            ;;
        3)
            deploy_github
            deploy_docker
            ;;
        4)
            log_info "Déploiement ignoré"
            ;;
        *)
            log_warning "Option invalide, déploiement ignoré"
            ;;
    esac
    
    echo ""
    log_success "🎉 Déploiement terminé avec succès!"
    echo ""
    echo "📋 Résumé:"
    echo "- Interface admin: http://localhost:8080/admin.html"
    echo "- Site principal: http://localhost:8080"
    echo "- Backend API: http://localhost:5000/api"
    echo "- Documentation: README.md"
    echo ""
    echo "🔐 Accès admin par défaut:"
    echo "- Email: admin@mireb.com"
    echo "- Mot de passe: admin123"
    echo ""
    echo "🛠️  Pour démarrer les services:"
    echo "- Backend: cd backend && npm start"
    echo "- Frontend: python3 -m http.server 8080"
    echo "- Docker: docker-compose up -d"
}

# Exécuter le script principal
main "$@"
