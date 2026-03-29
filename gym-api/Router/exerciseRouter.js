const express = require('express');
const router = express.Router();
const exerciseController = require('../Controller/exerciseController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.get('/', authMiddleware, exerciseController.getAllExercises);
router.get('/muscle-groups', authMiddleware, exerciseController.getMuscleGroups);
router.get('/search', authMiddleware, exerciseController.searchExercises);
router.get('/muscle/:nhomco', authMiddleware, exerciseController.getByMuscleGroup);
router.get('/difficulty/:dokho', authMiddleware, exerciseController.getByDifficulty);
router.get('/:id', authMiddleware, exerciseController.getExerciseById);

module.exports = router;
