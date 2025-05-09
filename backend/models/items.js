const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true
  },
  // sellerId:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref:'User',
  //   required:true
  // }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Item', itemSchema);