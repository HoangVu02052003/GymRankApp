const express = require('express');
const router = express.Router();

const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
const rankRouter = require('./rankRouter');
const workoutRouter = require('./workoutRouter');
const scheduleRouter = require('./scheduleRouter');
const AIRouter = require('./AIRouter');
const exerciseRouter = require('./exerciseRouter');
const verificationRouter = require('./verificationRouter');
const streakRouter = require('./streakRouter');
const expRouter = require('./expRouter');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/rank', rankRouter);
router.use('/workout', workoutRouter);
router.use('/schedule', scheduleRouter);
router.use('/ai', AIRouter);
router.use('/exercise', exerciseRouter);
router.use('/verification', verificationRouter);
router.use('/streak', streakRouter);
router.use('/exp', expRouter);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date()
  });
});

module.exports = router;
