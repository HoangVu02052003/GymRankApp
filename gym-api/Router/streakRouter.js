const express = require('express');
const router = express.Router();
const streakController = require('../Controller/streakController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.get('/', authMiddleware, streakController.getStreak);
router.get('/stats', authMiddleware, streakController.getStreakStats);
router.post('/maintain', authMiddleware, streakController.maintainStreak);

module.exports = router;
