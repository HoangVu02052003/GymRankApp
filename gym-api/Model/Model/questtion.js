const mongoose = require('mongoose');

const questtionSchema = new mongoose.Schema({
  questtion: {
    type: String,
    required: true
  },
  options: [{
    option: String,
    correct: Boolean
  }],
  correctanswer: {
    type: String,
    required: true
  },
  idrank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rank'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('questtion', questtionSchema);
