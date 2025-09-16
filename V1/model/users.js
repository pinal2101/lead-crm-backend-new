const mongoose = require('mongoose');

const usersModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: Number,
      unique: true,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'SuperAdmin'],
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    updatedDate: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('User', usersModel);
