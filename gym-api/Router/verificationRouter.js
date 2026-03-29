const express = require('express');
const router = express.Router();
const verificationController = require('../Controller/verificationController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.post('/upload', authMiddleware, verificationController.uploadVideo);
router.get('/', authMiddleware, verificationController.getUserVerifications);
router.get('/status', authMiddleware, verificationController.checkVerificationStatus);

module.exports = router;
