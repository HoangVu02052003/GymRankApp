const express = require('express');
const router = express.Router();
const rankController = require('../Controller/rankController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.get('/', authMiddleware, rankController.getAllRanks);
router.get('/current', authMiddleware, rankController.getCurrentRank);
router.get('/check-rankup', authMiddleware, rankController.checkRankUp);
router.post('/rankup', authMiddleware, rankController.rankUp);
router.post('/test/create', authMiddleware, rankController.createTest);
router.post('/test/submit', authMiddleware, rankController.submitTest);

module.exports = router;
