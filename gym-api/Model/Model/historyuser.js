const mongoose = require('mongoose');

const historyUserSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  datechange: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('historyuser', historyUserSchema);
