const mongoose = require('mongoose');

const thongtinSchema = new mongoose.Schema({
  ten: {
    type: String
  },
  tuoi: {
    type: Number
  },
  gioitinh: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác']
  },
  chieucao: {
    type: Number
  },
  cannang: {
    type: Number
  },
  idrank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rank'
  },
  idcomfirm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comfirm'
  },
  idtest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'test'
  },
  xacthuc: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('thongtin', thongtinSchema);
