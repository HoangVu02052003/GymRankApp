const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  totalexp: {
    type: Number,
    default: 0
  },
  dailyexp: {
    type: Number,
    default: 0
  },
  lastupdated: {
    type: Date,
    default: Date.now
  },
  lastexpreset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('exp', expSchema);
