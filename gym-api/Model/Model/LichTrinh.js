const mongoose = require('mongoose');

const lichTrinhSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  tenlich: {
    type: String,
    required: true
  },
  loailich: {
    type: String,
    enum: ['push', 'pull', 'leg', 'fullbody', 'custom'],
    default: 'custom'
  },
  idChiTiet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChiTietLichTrinh'
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdby: {
    type: String,
    enum: ['user', 'ai'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LichTrinh', lichTrinhSchema);
