require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/b2b-mireb';

async function initializeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'mirebcommercial@gmail.com' });
    
    if (adminExists) {
      console.log('💡 Un compte admin existe déjà avec cet email.');
      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const adminUser = new User({
      name: 'Mireb Commercial',
      email: 'mirebcommercial@gmail.com',
      password: 'Fiacre-19',
      role: 'admin'
    });

    await adminUser.save();
    
    // Log activity
    const activity = new Activity({
      user: adminUser._id,
      action: 'Initialisation du compte administrateur',
      details: 'Compte admin initialisé via script'
    });
    
    await activity.save();
    
    console.log('✅ Compte administrateur créé avec succès:');
    console.log('   Email: mirebcommercial@gmail.com');
    console.log('   Mot de passe: Fiacre-19');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du compte admin:', error);
    process.exit(1);
  }
}

initializeAdmin();
