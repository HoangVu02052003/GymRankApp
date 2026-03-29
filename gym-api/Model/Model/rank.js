const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
  tenrank: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  exprequired: {
    type: Number,
    required: true
  },
  requiretest: {
    type: Boolean,
    default: false
  },
  requirevideo: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  mota: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('rank', rankSchema);
