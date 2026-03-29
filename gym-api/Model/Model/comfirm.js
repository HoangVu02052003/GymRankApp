const mongoose = require('mongoose');

const comfirmSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  videourl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  adminNote: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('comfirm', comfirmSchema);
