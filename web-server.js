const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Servir les fichiers statiques
app.use(express.static('.'));

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour l'admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route pour les produits
app.get('/produits', (req, res) => {
    res.sendFile(path.join(__dirname, 'produits.html'));
});

// Route pour le contact
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Site web accessible sur http://localhost:${PORT}`);
    console.log(`📱 Interface admin: http://localhost:${PORT}/admin.html`);
    console.log(`🛍️  Produits: http://localhost:${PORT}/produits.html`);
    console.log(`📞 Contact: http://localhost:${PORT}/contact.html`);
});
