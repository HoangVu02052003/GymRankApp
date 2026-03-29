const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tk: {
    type: String,
    required: true,
    unique: true
  },
  matkhau: {
    type: String,
    required: true
  },
  idthongtin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'thongtin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('user', userSchema);
