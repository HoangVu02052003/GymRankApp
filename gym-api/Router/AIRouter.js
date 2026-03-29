const express = require('express');
const router = express.Router();
const AIController = require('../Controller/AIController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.post('/generate-plan', authMiddleware, AIController.generateWorkoutPlan);
router.get('/required-inputs', authMiddleware, AIController.getRequiredInputs);

module.exports = router;
