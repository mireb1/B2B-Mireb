const Product = require('../models/Product');
const Activity = require('../models/Activity');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, inStock } = req.body;
    
    const newProduct = new Product({
      name,
      description,
      price,
      image: image || '/assets/default-product.png',
      category,
      inStock: inStock !== undefined ? inStock : true
    });

    const savedProduct = await newProduct.save();

    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Création de produit',
        details: `Produit: ${name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du produit', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, inStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.updatedAt = Date.now();

    const updatedProduct = await product.save();

    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Mise à jour de produit',
        details: `Produit: ${product.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const productName = product.name;
    await product.deleteOne();

    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Suppression de produit',
        details: `Produit: ${productName}`,
        ipAddress: req.ip
      });
      await activity.save();
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error: error.message });
  }
};
