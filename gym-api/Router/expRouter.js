const express = require('express');
const router = express.Router();
const expController = require('../Controller/expController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.get('/', authMiddleware, expController.getExp);
router.get('/history', authMiddleware, expController.getExpHistory);

module.exports = router;
