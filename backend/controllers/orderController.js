const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('products.product', 'name price image');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product', 'name price image');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { customer, products, totalAmount, paymentMethod, notes } = req.body;
    
    // Create new order
    const newOrder = new Order({
      customer,
      products,
      totalAmount,
      paymentMethod: paymentMethod || 'paiement à la réception',
      notes
    });
    
    const savedOrder = await newOrder.save();
    
    // Check if customer exists, if not create a new one
    let customerDoc = await Customer.findOne({ email: customer.email });
    if (!customerDoc) {
      customerDoc = new Customer({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        orders: [savedOrder._id]
      });
    } else {
      customerDoc.orders.push(savedOrder._id);
    }
    await customerDoc.save();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Création de commande',
        details: `Commande: ${savedOrder._id}, Client: ${customer.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    order.status = status;
    order.updatedAt = Date.now();
    
    const updatedOrder = await order.save();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Mise à jour de statut de commande',
        details: `Commande: ${order._id}, Nouveau statut: ${status}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    // Remove order from customer's orders
    await Customer.updateOne(
      { email: order.customer.email },
      { $pull: { orders: order._id } }
    );
    
    await order.deleteOne();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Suppression de commande',
        details: `Commande: ${order._id}, Client: ${order.customer.name}`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error: error.message });
  }
};
