const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  idrank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rank',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalquestions: {
    type: Number,
    required: true
  },
  correctanswers: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  answers: [{
    idquestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'questtion'
    },
    useranswer: String,
    correct: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('test', testSchema);
