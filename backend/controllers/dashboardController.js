const Activity = require('../models/Activity');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Message = require('../models/Message');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('products.product', 'name price');
    
    // Calculate sales stats
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate status counts
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    res.json({
      counts: {
        orders: totalOrders,
        products: totalProducts,
        customers: totalCustomers,
        unreadMessages: unreadMessages
      },
      sales: {
        total: totalSales
      },
      orderStats: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
};

// Get activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .limit(req.query.limit ? parseInt(req.query.limit) : 50);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs d\'activité', error: error.message });
  }
};
