const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');
const Product = require('../models/Product');

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
    const { customer, products, totalAmount, paymentMethod, notes, deliveryInfo } = req.body;
    
    // Créer un historique de statut initial
    const initialStatus = {
      status: 'pending',
      timestamp: new Date(),
      comment: 'Commande reçue'
    };
    
    // Create new order
    const newOrder = new Order({
      customer,
      products,
      totalAmount,
      paymentMethod: paymentMethod || 'paiement à la livraison',
      notes,
      deliveryInfo,
      statusHistory: [initialStatus]
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
        orders: [savedOrder._id],
        orderCount: 1,
        totalSpent: totalAmount
      });
    } else {
      customerDoc.orders.push(savedOrder._id);
      customerDoc.orderCount = customerDoc.orderCount ? customerDoc.orderCount + 1 : 1;
      customerDoc.totalSpent = customerDoc.totalSpent ? customerDoc.totalSpent + totalAmount : totalAmount;
    }
    await customerDoc.save();
    
    // Mettre à jour les stocks des produits
    for (const item of products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { inStock: -item.quantity } }
      );
    }
    
    // Log activity
    const activity = new Activity({
      user: req.user ? req.user._id : null,
      action: 'Création de commande',
      details: `Commande: ${savedOrder._id}, Client: ${customer.name}`,
      ipAddress: req.ip
    });
    await activity.save();
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    order.status = status;
    
    // Ajouter à l'historique des statuts
    const statusUpdate = {
      status,
      timestamp: new Date(),
      comment: comment || `Statut mis à jour à "${status}"`
    };
    
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push(statusUpdate);
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

// Mettre à jour les informations de livraison
exports.updateDeliveryInfo = async (req, res) => {
  try {
    const { deliveryInfo } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    // Mettre à jour les informations de livraison
    if (!order.deliveryInfo) {
      order.deliveryInfo = {};
    }
    
    if (deliveryInfo.requestedDate) order.deliveryInfo.requestedDate = deliveryInfo.requestedDate;
    if (deliveryInfo.requestedTime) order.deliveryInfo.requestedTime = deliveryInfo.requestedTime;
    if (deliveryInfo.actualDeliveryDate) order.deliveryInfo.actualDeliveryDate = deliveryInfo.actualDeliveryDate;
    if (deliveryInfo.trackingNumber) order.deliveryInfo.trackingNumber = deliveryInfo.trackingNumber;
    if (deliveryInfo.deliveryPerson) order.deliveryInfo.deliveryPerson = deliveryInfo.deliveryPerson;
    if (deliveryInfo.currentLocation) order.deliveryInfo.currentLocation = deliveryInfo.currentLocation;
    if (deliveryInfo.estimatedArrival) order.deliveryInfo.estimatedArrival = deliveryInfo.estimatedArrival;
    
    order.updatedAt = Date.now();
    const updatedOrder = await order.save();
    
    // Log activity
    if (req.user) {
      const activity = new Activity({
        user: req.user._id,
        action: 'Mise à jour information de livraison',
        details: `Commande: ${order._id}, Informations de livraison mises à jour`,
        ipAddress: req.ip
      });
      await activity.save();
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des informations de livraison', error: error.message });
  }
};

// Mise à jour du suivi de livraison en temps réel
exports.updateDeliveryTracking = async (req, res) => {
  try {
    const { currentLocation, estimatedArrival } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    if (!order.deliveryInfo) {
      order.deliveryInfo = {};
    }
    
    if (currentLocation) {
      order.deliveryInfo.currentLocation = {
        ...currentLocation,
        updatedAt: new Date()
      };
    }
    
    if (estimatedArrival) {
      order.deliveryInfo.estimatedArrival = estimatedArrival;
    }
    
    order.updatedAt = Date.now();
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du suivi de livraison', error: error.message });
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

// Obtenir les statistiques des commandes
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('products.product', 'name image');
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
};
