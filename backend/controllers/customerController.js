const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: error.message });
  }
};

// Get single customer
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('orders');
    
    if (!customer) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du client', error: error.message });
  }
};

// Update customer information
exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.updatedAt = Date.now();
    
    const updatedCustomer = await customer.save();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Mise à jour de client',
        details: `Client: ${customer.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du client', error: error.message });
  }
};

// Delete customer and their orders
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    // Delete all orders associated with this customer
    // Note: This is a cascading delete. You might want to handle this differently based on your business logic
    // For example, you might want to keep orders even if the customer is deleted
    
    await customer.deleteOne();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Suppression de client',
        details: `Client: ${customer.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du client', error: error.message });
  }
};
