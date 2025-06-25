// Test simple du serveur pour debug
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware de base
app.use(express.json());
app.use(cors());

console.log('Test: Configuration de base OK');

// Test de connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/b2b-mireb';
console.log('Test: Connexion MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Test: MongoDB connecté avec succès');
  })
  .catch(err => {
    console.error('❌ Test: Erreur MongoDB:', err.message);
  });

console.log('Test: Import des routes...');

// Test des imports des routes une par une
try {
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes OK');
} catch (err) {
  console.error('❌ Erreur auth routes:', err.message);
}

try {
  const productRoutes = require('./routes/products');
  console.log('✅ Product routes OK');
} catch (err) {
  console.error('❌ Erreur product routes:', err.message);
}

try {
  const leadsRoutes = require('./routes/leads');
  console.log('✅ Leads routes OK');
} catch (err) {
  console.error('❌ Erreur leads routes:', err.message);
}

try {
  const deliveriesRoutes = require('./routes/deliveries');
  console.log('✅ Deliveries routes OK');
} catch (err) {
  console.error('❌ Erreur deliveries routes:', err.message);
}

try {
  const usersRoutes = require('./routes/users');
  console.log('✅ Users routes OK');
} catch (err) {
  console.error('❌ Erreur users routes:', err.message);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Test serveur démarré sur le port ${PORT}`);
});
