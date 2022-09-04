const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Message', messageSchema);