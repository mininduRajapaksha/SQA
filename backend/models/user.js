const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true    
  },
  email:{
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  homeAddress:{
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['customer', 'businessman'],
    default: 'customer'
  },
  password:{
        type: String,
        required: true,
    },
  
},{ timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);