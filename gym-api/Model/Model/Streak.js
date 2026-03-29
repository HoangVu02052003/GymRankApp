const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  currentstreak: {
    type: Number,
    default: 0
  },
  longeststreak: {
    type: Number,
    default: 0
  },
  lastactivedate: {
    type: Date,
    default: Date.now
  },
  streakhistory: [{
    date: Date,
    active: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Streak', streakSchema);
