const mongoose = require('mongoose');

const historyExpSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  expchange: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    enum: ['workout_completed', 'streak_penalty', 'rank_up', 'test_bonus', 'other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('historyExp', historyExpSchema);
