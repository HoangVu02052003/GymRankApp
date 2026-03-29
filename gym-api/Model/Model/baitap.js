const mongoose = require('mongoose');

const baitapSchema = new mongoose.Schema({
  tenbaitap: {
    type: String,
    required: true
  },
  nhomco: {
    type: String,
    required: true
  },
  mota: {
    type: String
  },
  video: {
    type: String
  },
  image: {
    type: String
  },
  dokho: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  thietbi: {
    type: String
  },
  huongdan: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('baitap', baitapSchema);
