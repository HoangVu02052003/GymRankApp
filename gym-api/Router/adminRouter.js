const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');
const adminMiddleware = require('../MiddleWare/adminMiddleware');

router.use(adminMiddleware);

router.get('/statistics', adminController.getStatistics);

router.get('/ranks', adminController.getAllRanks);
router.post('/ranks', adminController.createRank);
router.put('/ranks/:id', adminController.updateRank);
router.delete('/ranks/:id', adminController.deleteRank);

router.get('/exercises', adminController.getAllExercises);
router.post('/exercises', adminController.createExercise);
router.put('/exercises/:id', adminController.updateExercise);
router.delete('/exercises/:id', adminController.deleteExercise);

router.get('/questions', adminController.getAllQuestions);
router.post('/questions', adminController.createQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetail);

router.get('/verifications', adminController.getPendingVerifications);
router.post('/verifications/:id/approve', adminController.approveVerification);
router.post('/verifications/:id/reject', adminController.rejectVerification);

module.exports = router;
