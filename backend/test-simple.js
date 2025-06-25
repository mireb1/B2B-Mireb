// Serveur de test simple
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Serveur backend fonctionnel', timestamp: new Date().toISOString() });
});

// Route de base
app.get('/', (req, res) => {
    res.json({ message: 'Mireb B2B Backend API', version: '1.0.0' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
});
