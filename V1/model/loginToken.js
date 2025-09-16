const mongoose = require('mongoose');

const loginTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  token: {
    type: String,
    required: true
  },
createdAt: { type: Date, default: Date.now, expires: 172800  }
  
});

module.exports = mongoose.model('loginToken', loginTokenSchema);
