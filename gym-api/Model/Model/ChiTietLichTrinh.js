const mongoose = require('mongoose');

const chiTietLichTrinhSchema = new mongoose.Schema({
  idbaitap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'baitap',
    required: true
  },
  sets: {
    type: Number,
    default: 3
  },
  reps: {
    type: String,
    default: '8-12'
  },
  date: {
    type: Date,
    default: Date.now
  },
  trangthai: {
    type: Boolean,
    default: false
  },
  ghichu: {
    type: String
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChiTietLichTrinh', chiTietLichTrinhSchema);
