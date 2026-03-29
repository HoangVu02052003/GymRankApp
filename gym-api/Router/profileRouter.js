const express = require('express');
const router = express.Router();
const profileController = require('../Controller/profileController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, profileController.updateProfile);
router.get('/stats', authMiddleware, profileController.getFullStats);

module.exports = router;
