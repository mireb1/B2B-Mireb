const Category = require('../models/Category');
const Activity = require('../models/Activity');

// Obtenir toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error: error.message });
  }
};

// Obtenir les catégories principales (sans parent)
exports.getMainCategories = async (req, res) => {
  try {
    const mainCategories = await Category.find({ parentCategory: null }).sort({ order: 1 });
    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories principales', error: error.message });
  }
};

// Obtenir une seule catégorie
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie', error: error.message });
  }
};

// Obtenir une catégorie par son slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie', error: error.message });
  }
};

// Obtenir les sous-catégories d'une catégorie
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.find({ parentCategory: req.params.id }).sort({ order: 1 });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des sous-catégories', error: error.message });
  }
};

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const { name, description, slug, icon, image, parentCategory, order } = req.body;
    
    const newCategory = new Category({
      name,
      description,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      icon,
      image,
      parentCategory: parentCategory || null,
      order: order || 0
    });

    const savedCategory = await newCategory.save();

    // Log de l'activité
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Création de catégorie',
        details: `Catégorie: ${name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie', error: error.message });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, slug, icon, image, parentCategory, order } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.slug = slug || category.slug;
    category.icon = icon || category.icon;
    category.image = image || category.image;
    category.parentCategory = parentCategory !== undefined ? parentCategory : category.parentCategory;
    category.order = order !== undefined ? order : category.order;
    category.updatedAt = Date.now();

    const updatedCategory = await category.save();

    // Log de l'activité
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Mise à jour de catégorie',
        details: `Catégorie: ${category.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error: error.message });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    const categoryName = category.name;
    
    // Vérifier s'il existe des sous-catégories
    const hasSubcategories = await Category.exists({ parentCategory: req.params.id });
    if (hasSubcategories) {
      return res.status(400).json({ message: 'Impossible de supprimer la catégorie car elle possède des sous-catégories' });
    }

    await category.deleteOne();

    // Log de l'activité
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Suppression de catégorie',
        details: `Catégorie: ${categoryName}`,
        ipAddress: req.ip
      });
      await activity.save();
    }

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error: error.message });
  }
};
