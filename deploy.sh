#!/bin/bash

# Script de déploiement et publication Git pour Mireb B2B

echo "🚀 Script de déploiement Mireb B2B Marketplace"
echo "=============================================="

# Vérifier si c'est un dépôt Git
if [ ! -d ".git" ]; then
    echo "📁 Initialisation du dépôt Git..."
    git init
    echo "✅ Dépôt Git initialisé"
fi

# Ajouter tous les fichiers
echo "📋 Ajout des fichiers..."
git add .

# Demander le message de commit
read -p "💬 Message de commit (optionnel): " commit_message

# Utiliser un message par défaut si vide
if [ -z "$commit_message" ]; then
    commit_message="Mise à jour Mireb B2B Marketplace - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Commit
echo "💾 Création du commit..."
git commit -m "$commit_message"

# Vérifier si une remote existe
if ! git remote | grep -q "origin"; then
    echo "🔗 Configuration de la remote GitHub..."
    read -p "📍 URL du dépôt GitHub (https://github.com/username/repo.git): " repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote ajoutée: $repo_url"
    else
        echo "⚠️  Aucune remote configurée. Vous pouvez la configurer plus tard avec:"
        echo "   git remote add origin https://github.com/username/repo.git"
    fi
fi

# Pousser vers GitHub
if git remote | grep -q "origin"; then
    echo "🚀 Publication sur GitHub..."
    
    # Vérifier la branche courante
    current_branch=$(git branch --show-current)
    if [ -z "$current_branch" ]; then
        current_branch="main"
        git branch -M main
    fi
    
    # Pousser
    if git push -u origin "$current_branch" 2>/dev/null; then
        echo "✅ Publication réussie sur GitHub!"
        echo "🌐 Votre projet est maintenant disponible sur GitHub"
        
        # Proposer GitHub Pages
        echo ""
        echo "🌟 Voulez-vous activer GitHub Pages pour héberger votre site?"
        echo "   1. Allez sur votre dépôt GitHub"
        echo "   2. Cliquez sur 'Settings'"
        echo "   3. Allez dans 'Pages'"
        echo "   4. Sélectionnez 'Deploy from a branch'"
        echo "   5. Choisissez 'main' et '/ (root)'"
        echo "   6. Votre site sera disponible à l'adresse:"
        echo "      https://username.github.io/repository-name"
        
    else
        echo "⚠️  Échec de la publication. Vérifiez vos permissions GitHub."
        echo "   Vous pouvez pousser manuellement avec:"
        echo "   git push -u origin $current_branch"
    fi
else
    echo "⚠️  Aucune remote configurée. Commit local créé."
    echo "   Pour publier sur GitHub:"
    echo "   1. Créez un nouveau dépôt sur GitHub"
    echo "   2. Exécutez: git remote add origin https://github.com/username/repo.git"
    echo "   3. Exécutez: git push -u origin main"
fi

echo ""
echo "📊 Statut actuel du dépôt:"
git status --short

echo ""
echo "🎉 Déploiement terminé!"
echo "📱 Interface admin: http://localhost:8080/admin.html"
echo "🌐 Site principal: http://localhost:8080"
