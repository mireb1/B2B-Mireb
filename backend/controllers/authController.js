const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');

// Register new admin (only for initial setup)
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Create new user with admin role
    const user = new User({
      email,
      password,
      name,
      role: 'admin'
    });

    await user.save();

    // Log activity
    const activity = new Activity({
      user: user._id,
      action: 'Création de compte administrateur',
      ipAddress: req.ip
    });
    await activity.save();

    res.status(201).json({ message: 'Compte administrateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du compte', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    const activity = new Activity({
      user: user._id,
      action: 'Connexion',
      ipAddress: req.ip
    });
    await activity.save();

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log activity
    const activity = new Activity({
      user: user._id,
      action: 'Changement de mot de passe',
      ipAddress: req.ip
    });
    await activity.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe', error: error.message });
  }
};
