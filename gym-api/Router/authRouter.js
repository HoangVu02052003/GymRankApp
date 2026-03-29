const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
