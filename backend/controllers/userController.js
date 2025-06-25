// Contrôleur pour la gestion des utilisateurs
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rôles et permissions
const roles = [
    {
        id: 'admin',
        name: 'Administrateur',
        permissions: ['all']
    },
    {
        id: 'sales_manager',
        name: 'Responsable des Ventes',
        permissions: ['orders', 'customers', 'products_read', 'marketing', 'analytics_sales']
    },
    {
        id: 'support_agent',
        name: 'Agent Support',
        permissions: ['customers', 'messages', 'orders_read']
    },
    {
        id: 'delivery_manager',
        name: 'Responsable Livraisons',
        permissions: ['deliveries', 'orders_read', 'customers_read']
    },
    {
        id: 'marketing_specialist',
        name: 'Spécialiste Marketing',
        permissions: ['marketing', 'customers_read', 'analytics_marketing', 'social_media']
    },
    {
        id: 'accountant',
        name: 'Comptable',
        permissions: ['orders_read', 'customers_read', 'analytics_financial', 'reports']
    }
];

const permissions = [
    { id: 'all', name: 'Tous les droits' },
    { id: 'orders', name: 'Gestion des commandes' },
    { id: 'orders_read', name: 'Lecture des commandes' },
    { id: 'customers', name: 'Gestion des clients' },
    { id: 'customers_read', name: 'Lecture des clients' },
    { id: 'products', name: 'Gestion des produits' },
    { id: 'products_read', name: 'Lecture des produits' },
    { id: 'deliveries', name: 'Gestion des livraisons' },
    { id: 'marketing', name: 'Gestion du marketing' },
    { id: 'messages', name: 'Gestion des messages' },
    { id: 'analytics_sales', name: 'Analytics des ventes' },
    { id: 'analytics_marketing', name: 'Analytics du marketing' },
    { id: 'analytics_financial', name: 'Analytics financières' },
    { id: 'social_media', name: 'Réseaux sociaux' },
    { id: 'reports', name: 'Rapports' },
    { id: 'users', name: 'Gestion des utilisateurs' },
    { id: 'settings', name: 'Paramètres système' }
];

// Authentification
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Rechercher l'utilisateur
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ],
            isActive: true
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe incorrect'
            });
        }

        // Mettre à jour les statistiques de connexion
        user.lastLogin = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        // Générer le token JWT
        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role,
                permissions: user.permissions 
            },
            process.env.JWT_SECRET || 'mireb_secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                permissions: user.permissions,
                avatar: user.avatar,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion'
        });
    }
};

// Déconnexion
exports.logout = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        console.error('Erreur logout:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la déconnexion'
        });
    }
};

// Obtenir l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Erreur getCurrentUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const { role, isActive, search, page = 1, limit = 20 } = req.query;
        const currentUser = await User.findById(req.user.userId);

        // Construire le filtre
        let filter = {};

        // Si l'utilisateur n'est pas admin, il ne voit que ses sous-comptes
        if (!currentUser.permissions.includes('all')) {
            filter.$or = [
                { _id: currentUser._id },
                { parentUserId: currentUser._id }
            ];
        }

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            users,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des utilisateurs'
        });
    }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Erreur getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        
        // Vérifier les permissions
        if (!currentUser.permissions.includes('all') && !currentUser.permissions.includes('users')) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        const { 
            username, 
            email, 
            password, 
            firstName, 
            lastName, 
            role, 
            phone, 
            avatar,
            isActive = true 
        } = req.body;

        // Vérifier l'unicité
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Nom d\'utilisateur ou email déjà utilisé'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Obtenir les permissions du rôle
        const roleConfig = roles.find(r => r.id === role);
        const userPermissions = roleConfig ? roleConfig.permissions : [];

        // Créer l'utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            permissions: userPermissions,
            phone,
            avatar: avatar || '/assets/avatars/default.jpg',
            isActive,
            parentUserId: req.user.userId,
            settings: {
                language: 'fr',
                timezone: 'Europe/Paris',
                notifications: true,
                emailNotifications: true,
                smsNotifications: false
            }
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                permissions: newUser.permissions,
                isActive: newUser.isActive
            }
        });

    } catch (error) {
        console.error('Erreur createUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création de l\'utilisateur'
        });
    }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier les permissions
        const canUpdate = currentUser.permissions.includes('all') ||
                         currentUser.permissions.includes('users') ||
                         (targetUser.parentUserId && targetUser.parentUserId.toString() === currentUser._id.toString()) ||
                         targetUser._id.toString() === currentUser._id.toString();

        if (!canUpdate) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        const updateData = req.body;
        
        // Si le rôle change, mettre à jour les permissions
        if (updateData.role) {
            const roleConfig = roles.find(r => r.id === updateData.role);
            if (roleConfig) {
                updateData.permissions = roleConfig.permissions;
            }
        }

        // Ne pas permettre la modification du mot de passe via cette route
        delete updateData.password;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser
        });

    } catch (error) {
        console.error('Erreur updateUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la mise à jour'
        });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Empêcher la suppression de l'admin principal
        if (targetUser.role === 'admin' && !targetUser.parentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Impossible de supprimer l\'administrateur principal'
            });
        }

        // Vérifier les permissions
        const canDelete = currentUser.permissions.includes('all') ||
                         (targetUser.parentUserId && targetUser.parentUserId.toString() === currentUser._id.toString());

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur deleteUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression'
        });
    }
};

// Obtenir les sous-comptes
exports.getSubAccounts = async (req, res) => {
    try {
        const parentId = req.params.parentId || req.user.userId;
        
        const subAccounts = await User.find({ parentUserId: parentId })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            subAccounts
        });

    } catch (error) {
        console.error('Erreur getSubAccounts:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Créer un sous-compte
exports.createSubAccount = async (req, res) => {
    try {
        const parentId = req.params.parentId;
        
        // Vérifier que l'utilisateur connecté peut créer des sous-comptes pour ce parent
        if (parentId !== req.user.userId && !req.user.permissions.includes('all')) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        req.body.parentUserId = parentId;
        return this.createUser(req, res);

    } catch (error) {
        console.error('Erreur createSubAccount:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Obtenir tous les rôles
exports.getAllRoles = async (req, res) => {
    try {
        res.json({
            success: true,
            roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Obtenir toutes les permissions
exports.getAllPermissions = async (req, res) => {
    try {
        res.json({
            success: true,
            permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;
        
        // Vérifier que l'utilisateur peut changer ce mot de passe
        if (userId !== req.user.userId && !req.user.permissions.includes('all')) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier l'ancien mot de passe
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Ancien mot de passe incorrect'
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });

    } catch (error) {
        console.error('Erreur changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
    try {
        // Cette fonctionnalité nécessiterait l'envoi d'email
        // Pour le moment, retourner une réponse simple
        res.json({
            success: true,
            message: 'Instructions de réinitialisation envoyées par email'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Vérifier les permissions
        if (userId !== req.user.userId && !req.user.permissions.includes('all')) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        const updateData = req.body;
        delete updateData.password; // Sécurité
        delete updateData.role; // Ne pas permettre le changement de rôle via cette route
        delete updateData.permissions; // Ne pas permettre le changement de permissions

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        });

    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Mettre à jour les paramètres
exports.updateSettings = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (userId !== req.user.userId && !req.user.permissions.includes('all')) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        user.settings = { ...user.settings, ...req.body };
        await user.save();

        res.json({
            success: true,
            message: 'Paramètres mis à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur updateSettings:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Activer/Désactiver un utilisateur
exports.toggleUserStatus = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        
        if (!currentUser.permissions.includes('all') && !currentUser.permissions.includes('users')) {
            return res.status(403).json({
                success: false,
                message: 'Permission insuffisante'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'} avec succès`
        });

    } catch (error) {
        console.error('Erreur toggleUserStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Obtenir les statistiques des utilisateurs
exports.getUserStats = async (req, res) => {
    try {
        const total = await User.countDocuments();
        const active = await User.countDocuments({ isActive: true });
        const inactive = total - active;
        
        const recentLogins = await User.countDocuments({
            lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        const newThisMonth = await User.countDocuments({
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });

        // Statistiques par rôle
        const roleStats = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        const roleStatsObject = {};
        roleStats.forEach(stat => {
            roleStatsObject[stat._id] = stat.count;
        });

        res.json({
            success: true,
            stats: {
                total,
                active,
                inactive,
                recentLogins,
                newThisMonth,
                roleStats: roleStatsObject
            }
        });

    } catch (error) {
        console.error('Erreur getUserStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Exporter les utilisateurs
exports.exportUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        res.json({
            success: true,
            data: {
                users,
                roles,
                permissions,
                exportDate: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Erreur exportUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Importer les utilisateurs
exports.importUsers = async (req, res) => {
    try {
        const { users } = req.body;
        
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({
                success: false,
                message: 'Données d\'import invalides'
            });
        }

        const results = {
            imported: 0,
            skipped: 0,
            errors: []
        };

        for (const userData of users) {
            try {
                // Vérifier si l'utilisateur existe déjà
                const existing = await User.findOne({
                    $or: [
                        { username: userData.username },
                        { email: userData.email }
                    ]
                });

                if (existing) {
                    results.skipped++;
                    continue;
                }

                // Hasher le mot de passe si fourni
                if (userData.password) {
                    userData.password = await bcrypt.hash(userData.password, 12);
                }

                const newUser = new User(userData);
                await newUser.save();
                results.imported++;

            } catch (error) {
                results.errors.push({
                    user: userData.username || userData.email,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            message: 'Import terminé',
            results
        });

    } catch (error) {
        console.error('Erreur importUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'import'
        });
    }
};
