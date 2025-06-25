// Gestion des utilisateurs et sous-comptes (filles) pour Mireb Commercial
// Système de rôles et permissions avancé

class UserManager {
    constructor() {
        this.users = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@mireb.com',
                password: 'admin123', // En production, utiliser du hachage
                firstName: 'Administrator',
                lastName: 'Mireb',
                role: 'admin',
                permissions: ['all'],
                isActive: true,
                avatar: '/assets/avatars/admin.jpg',
                phone: '+33123456789',
                createdAt: '2025-01-01T00:00:00',
                lastLogin: '2025-06-25T10:00:00',
                loginCount: 156,
                settings: {
                    language: 'fr',
                    timezone: 'Europe/Paris',
                    notifications: true,
                    emailNotifications: true,
                    smsNotifications: false
                }
            },
            {
                id: 2,
                username: 'sophie_vente',
                email: 'sophie@mireb.com',
                password: 'sophie123',
                firstName: 'Sophie',
                lastName: 'Martin',
                role: 'sales_manager',
                permissions: ['orders', 'customers', 'products_read', 'marketing'],
                isActive: true,
                avatar: '/assets/avatars/sophie.jpg',
                phone: '+33234567890',
                createdAt: '2025-02-15T00:00:00',
                lastLogin: '2025-06-24T16:30:00',
                loginCount: 89,
                parentUserId: 1,
                settings: {
                    language: 'fr',
                    timezone: 'Europe/Paris',
                    notifications: true,
                    emailNotifications: true,
                    smsNotifications: true
                }
            },
            {
                id: 3,
                username: 'marie_support',
                email: 'marie@mireb.com',
                password: 'marie123',
                firstName: 'Marie',
                lastName: 'Dubois',
                role: 'support_agent',
                permissions: ['customers', 'messages', 'orders_read'],
                isActive: true,
                avatar: '/assets/avatars/marie.jpg',
                phone: '+33345678901',
                createdAt: '2025-03-01T00:00:00',
                lastLogin: '2025-06-25T09:15:00',
                loginCount: 45,
                parentUserId: 1,
                settings: {
                    language: 'fr',
                    timezone: 'Europe/Paris',
                    notifications: true,
                    emailNotifications: false,
                    smsNotifications: true
                }
            },
            {
                id: 4,
                username: 'paul_livraison',
                email: 'paul@mireb.com',
                password: 'paul123',
                firstName: 'Paul',
                lastName: 'Durand',
                role: 'delivery_manager',
                permissions: ['deliveries', 'orders_read', 'customers_read'],
                isActive: true,
                avatar: '/assets/avatars/paul.jpg',
                phone: '+33456789012',
                createdAt: '2025-03-15T00:00:00',
                lastLogin: '2025-06-25T08:00:00',
                loginCount: 67,
                parentUserId: 1,
                settings: {
                    language: 'fr',
                    timezone: 'Europe/Paris',
                    notifications: true,
                    emailNotifications: true,
                    smsNotifications: true
                }
            }
        ];

        this.roles = [
            {
                id: 'admin',
                name: 'Administrateur',
                description: 'Accès complet à toutes les fonctionnalités',
                permissions: ['all'],
                color: '#e74c3c',
                icon: 'fas fa-crown'
            },
            {
                id: 'sales_manager',
                name: 'Responsable des Ventes',
                description: 'Gestion des ventes, clients et marketing',
                permissions: ['orders', 'customers', 'products_read', 'marketing', 'analytics_sales'],
                color: '#3498db',
                icon: 'fas fa-chart-line'
            },
            {
                id: 'support_agent',
                name: 'Agent Support',
                description: 'Support client et gestion des messages',
                permissions: ['customers', 'messages', 'orders_read'],
                color: '#2ecc71',
                icon: 'fas fa-headset'
            },
            {
                id: 'delivery_manager',
                name: 'Responsable Livraisons',
                description: 'Gestion des livraisons et logistique',
                permissions: ['deliveries', 'orders_read', 'customers_read'],
                color: '#f39c12',
                icon: 'fas fa-truck'
            },
            {
                id: 'marketing_specialist',
                name: 'Spécialiste Marketing',
                description: 'Gestion du marketing et des campagnes',
                permissions: ['marketing', 'customers_read', 'analytics_marketing', 'social_media'],
                color: '#9b59b6',
                icon: 'fas fa-bullhorn'
            },
            {
                id: 'accountant',
                name: 'Comptable',
                description: 'Gestion financière et comptabilité',
                permissions: ['orders_read', 'customers_read', 'analytics_financial', 'reports'],
                color: '#34495e',
                icon: 'fas fa-calculator'
            }
        ];

        this.permissions = [
            { id: 'all', name: 'Tous les droits', category: 'system' },
            { id: 'orders', name: 'Gestion des commandes', category: 'orders' },
            { id: 'orders_read', name: 'Lecture des commandes', category: 'orders' },
            { id: 'customers', name: 'Gestion des clients', category: 'customers' },
            { id: 'customers_read', name: 'Lecture des clients', category: 'customers' },
            { id: 'products', name: 'Gestion des produits', category: 'products' },
            { id: 'products_read', name: 'Lecture des produits', category: 'products' },
            { id: 'deliveries', name: 'Gestion des livraisons', category: 'deliveries' },
            { id: 'marketing', name: 'Gestion du marketing', category: 'marketing' },
            { id: 'messages', name: 'Gestion des messages', category: 'communication' },
            { id: 'analytics_sales', name: 'Analytics des ventes', category: 'analytics' },
            { id: 'analytics_marketing', name: 'Analytics du marketing', category: 'analytics' },
            { id: 'analytics_financial', name: 'Analytics financières', category: 'analytics' },
            { id: 'social_media', name: 'Réseaux sociaux', category: 'marketing' },
            { id: 'reports', name: 'Rapports', category: 'reports' },
            { id: 'users', name: 'Gestion des utilisateurs', category: 'system' },
            { id: 'settings', name: 'Paramètres système', category: 'system' }
        ];

        this.currentUser = null;
        this.loginAttempts = {};
    }

    // Authentification
    login(username, password) {
        const user = this.users.find(u => 
            (u.username === username || u.email === username) && u.isActive
        );

        if (!user) {
            this.recordFailedLogin(username);
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        // Vérifier les tentatives de connexion
        if (this.isAccountLocked(username)) {
            return { success: false, message: 'Compte temporairement verrouillé' };
        }

        // Vérifier le mot de passe (en production, utiliser bcrypt)
        if (user.password !== password) {
            this.recordFailedLogin(username);
            return { success: false, message: 'Mot de passe incorrect' };
        }

        // Succès de la connexion
        this.currentUser = user;
        user.lastLogin = new Date().toISOString();
        user.loginCount++;
        delete this.loginAttempts[username];
        
        this.saveToLocalStorage();
        
        return { 
            success: true, 
            user: this.sanitizeUser(user),
            message: 'Connexion réussie' 
        };
    }

    // Déconnexion
    logout() {
        this.currentUser = null;
        return { success: true, message: 'Déconnexion réussie' };
    }

    // Obtenir l'utilisateur connecté
    getCurrentUser() {
        return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
    }

    // Vérifier une permission
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes('all') || 
               this.currentUser.permissions.includes(permission);
    }

    // Vérifier un rôle
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Créer un nouvel utilisateur (fille)
    createUser(userData, parentUserId = null) {
        // Vérifier les permissions
        if (!this.hasPermission('users') && !this.hasPermission('all')) {
            return { success: false, message: 'Permission insuffisante' };
        }

        // Vérifier l'unicité
        const existingUser = this.users.find(u => 
            u.username === userData.username || u.email === userData.email
        );
        
        if (existingUser) {
            return { success: false, message: 'Nom d\'utilisateur ou email déjà utilisé' };
        }

        const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
        const newUser = {
            id: newId,
            username: userData.username,
            email: userData.email,
            password: userData.password, // En production, hasher le mot de passe
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            permissions: this.getRolePermissions(userData.role),
            isActive: true,
            avatar: userData.avatar || '/assets/avatars/default.jpg',
            phone: userData.phone || '',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginCount: 0,
            parentUserId: parentUserId || this.currentUser?.id,
            settings: {
                language: 'fr',
                timezone: 'Europe/Paris',
                notifications: true,
                emailNotifications: true,
                smsNotifications: false
            }
        };

        this.users.push(newUser);
        this.saveToLocalStorage();

        return { 
            success: true, 
            user: this.sanitizeUser(newUser),
            message: 'Utilisateur créé avec succès' 
        };
    }

    // Mettre à jour un utilisateur
    updateUser(userId, updateData) {
        if (!this.hasPermission('users') && !this.hasPermission('all')) {
            return { success: false, message: 'Permission insuffisante' };
        }

        const userIndex = this.users.findIndex(u => u.id === parseInt(userId));
        if (userIndex === -1) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        // Vérifier si c'est un sous-compte de l'utilisateur connecté
        const user = this.users[userIndex];
        if (user.parentUserId && user.parentUserId !== this.currentUser?.id && 
            !this.hasPermission('all')) {
            return { success: false, message: 'Vous ne pouvez modifier que vos sous-comptes' };
        }

        // Mettre à jour les données
        Object.keys(updateData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
                this.users[userIndex][key] = updateData[key];
            }
        });

        // Mettre à jour les permissions si le rôle a changé
        if (updateData.role) {
            this.users[userIndex].permissions = this.getRolePermissions(updateData.role);
        }

        this.saveToLocalStorage();

        return { 
            success: true, 
            user: this.sanitizeUser(this.users[userIndex]),
            message: 'Utilisateur mis à jour avec succès' 
        };
    }

    // Supprimer un utilisateur
    deleteUser(userId) {
        if (!this.hasPermission('users') && !this.hasPermission('all')) {
            return { success: false, message: 'Permission insuffisante' };
        }

        const userIndex = this.users.findIndex(u => u.id === parseInt(userId));
        if (userIndex === -1) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        const user = this.users[userIndex];
        
        // Empêcher la suppression de l'admin principal
        if (user.role === 'admin' && !user.parentUserId) {
            return { success: false, message: 'Impossible de supprimer l\'administrateur principal' };
        }

        // Vérifier si c'est un sous-compte de l'utilisateur connecté
        if (user.parentUserId && user.parentUserId !== this.currentUser?.id && 
            !this.hasPermission('all')) {
            return { success: false, message: 'Vous ne pouvez supprimer que vos sous-comptes' };
        }

        this.users.splice(userIndex, 1);
        this.saveToLocalStorage();

        return { success: true, message: 'Utilisateur supprimé avec succès' };
    }

    // Obtenir tous les utilisateurs (avec filtres)
    getAllUsers(filters = {}) {
        let filteredUsers = [...this.users];

        // Filtrer par utilisateur parent (pour voir seulement ses filles)
        if (!this.hasPermission('all')) {
            filteredUsers = filteredUsers.filter(u => 
                u.id === this.currentUser?.id || u.parentUserId === this.currentUser?.id
            );
        }

        if (filters.role) {
            filteredUsers = filteredUsers.filter(u => u.role === filters.role);
        }

        if (filters.isActive !== undefined) {
            filteredUsers = filteredUsers.filter(u => u.isActive === filters.isActive);
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filteredUsers = filteredUsers.filter(u => 
                u.username.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search) ||
                u.firstName.toLowerCase().includes(search) ||
                u.lastName.toLowerCase().includes(search)
            );
        }

        return filteredUsers.map(u => this.sanitizeUser(u));
    }

    // Obtenir les sous-comptes d'un utilisateur
    getSubAccounts(userId = null) {
        const parentId = userId || this.currentUser?.id;
        return this.users
            .filter(u => u.parentUserId === parentId)
            .map(u => this.sanitizeUser(u));
    }

    // Obtenir les permissions d'un rôle
    getRolePermissions(roleId) {
        const role = this.roles.find(r => r.id === roleId);
        return role ? role.permissions : [];
    }

    // Obtenir tous les rôles
    getAllRoles() {
        return this.roles;
    }

    // Obtenir toutes les permissions
    getAllPermissions() {
        return this.permissions;
    }

    // Changer le mot de passe
    changePassword(userId, oldPassword, newPassword) {
        const user = this.users.find(u => u.id === parseInt(userId));
        if (!user) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        // Vérifier l'ancien mot de passe
        if (user.password !== oldPassword) {
            return { success: false, message: 'Ancien mot de passe incorrect' };
        }

        // Mettre à jour le mot de passe
        user.password = newPassword; // En production, hasher le mot de passe
        this.saveToLocalStorage();

        return { success: true, message: 'Mot de passe modifié avec succès' };
    }

    // Mettre à jour les paramètres utilisateur
    updateUserSettings(userId, settings) {
        const user = this.users.find(u => u.id === parseInt(userId));
        if (!user) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        user.settings = { ...user.settings, ...settings };
        this.saveToLocalStorage();

        return { success: true, message: 'Paramètres mis à jour' };
    }

    // Activer/Désactiver un utilisateur
    toggleUserStatus(userId) {
        if (!this.hasPermission('users') && !this.hasPermission('all')) {
            return { success: false, message: 'Permission insuffisante' };
        }

        const user = this.users.find(u => u.id === parseInt(userId));
        if (!user) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        user.isActive = !user.isActive;
        this.saveToLocalStorage();

        return { 
            success: true, 
            message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'}` 
        };
    }

    // Enregistrer une tentative de connexion échouée
    recordFailedLogin(username) {
        if (!this.loginAttempts[username]) {
            this.loginAttempts[username] = [];
        }
        
        this.loginAttempts[username].push(new Date());
        
        // Garder seulement les 5 dernières tentatives
        if (this.loginAttempts[username].length > 5) {
            this.loginAttempts[username] = this.loginAttempts[username].slice(-5);
        }
    }

    // Vérifier si le compte est verrouillé
    isAccountLocked(username) {
        const attempts = this.loginAttempts[username];
        if (!attempts || attempts.length < 3) return false;

        const recentAttempts = attempts.filter(attempt => 
            new Date() - attempt < 15 * 60 * 1000 // 15 minutes
        );

        return recentAttempts.length >= 3;
    }

    // Nettoyer les données utilisateur (enlever le mot de passe)
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    // Obtenir les statistiques des utilisateurs
    getUserStats() {
        const activeUsers = this.users.filter(u => u.isActive);
        const recentLogins = this.users.filter(u => 
            u.lastLogin && new Date() - new Date(u.lastLogin) < 24 * 60 * 60 * 1000
        );

        const roleStats = {};
        this.users.forEach(user => {
            roleStats[user.role] = (roleStats[user.role] || 0) + 1;
        });

        return {
            total: this.users.length,
            active: activeUsers.length,
            inactive: this.users.length - activeUsers.length,
            recentLogins: recentLogins.length,
            roleStats,
            averageLoginCount: Math.round(this.users.reduce((sum, u) => sum + u.loginCount, 0) / this.users.length)
        };
    }

    // Sauvegarder dans le localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('mireb_users', JSON.stringify(this.users));
            localStorage.setItem('mireb_current_user', JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
        }
    }

    // Charger depuis le localStorage
    loadFromLocalStorage() {
        try {
            const savedUsers = localStorage.getItem('mireb_users');
            const savedCurrentUser = localStorage.getItem('mireb_current_user');
            
            if (savedUsers) {
                this.users = JSON.parse(savedUsers);
            }
            
            if (savedCurrentUser) {
                this.currentUser = JSON.parse(savedCurrentUser);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
        }
    }

    // Exporter les données
    exportData() {
        return {
            users: this.users.map(u => this.sanitizeUser(u)),
            roles: this.roles,
            permissions: this.permissions,
            exportDate: new Date().toISOString()
        };
    }
}

// Initialiser le gestionnaire d'utilisateurs
window.userManager = new UserManager();
window.userManager.loadFromLocalStorage();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
}
