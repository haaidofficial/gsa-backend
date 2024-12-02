const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image file paths
    required: true,
  },
  pageUrl: {
    type: String,
    required: true,
    unique: true, // Ensures uniqueness
    index: true,  // Improves query performance
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {  
    type: Boolean,
    default: false, // Default is false, indicating the product is not deleted
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

