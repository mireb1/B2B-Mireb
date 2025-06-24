const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'paiement à la livraison'
  },
  notes: String,
  deliveryInfo: {
    requestedDate: {
      type: Date,
      required: true
    },
    requestedTime: {
      type: String,
      required: true
    },
    actualDeliveryDate: {
      type: Date
    },
    trackingNumber: {
      type: String
    },
    deliveryPerson: {
      name: String,
      phone: String
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date
    },
    estimatedArrival: {
      type: Date
    }
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      comment: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
