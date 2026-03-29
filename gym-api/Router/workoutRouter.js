const express = require('express');
const router = express.Router();
const workoutController = require('../Controller/workoutController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.post('/complete', authMiddleware, workoutController.completeExercise);
router.get('/today', authMiddleware, workoutController.getTodayWorkout);
router.get('/history', authMiddleware, workoutController.getWorkoutHistory);
router.post('/update-progress', authMiddleware, workoutController.updateWorkoutProgress);

module.exports = router;
