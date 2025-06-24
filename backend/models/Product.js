const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: '/assets/default-product.png'
  },
  category: {
    type: String,
    required: true,
    enum: ['health', 'cosmetics', 'wellness', 'biotechnology', 'fashion', 'home', 'it', 'electronics', 'accessories', 'phone']
  },
  mainCategory: {
    type: String,
    required: false
  },
  subCategory: {
    type: String,
    required: false
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  },
  promotionLabel: {
    type: String,
    enum: ['none', 'new', 'sale', 'hot', 'limited'],
    default: 'none'
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  inStock: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
