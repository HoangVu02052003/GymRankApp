const express = require('express');
const router = express.Router();
const scheduleController = require('../Controller/scheduleController');
const authMiddleware = require('../MiddleWare/authMiddleware');

router.post('/', authMiddleware, scheduleController.createSchedule);
router.get('/', authMiddleware, scheduleController.getUserSchedules);
router.get('/today', authMiddleware, scheduleController.getTodaySchedule);
router.get('/week', authMiddleware, scheduleController.getWeekSchedule);
router.get('/:id', authMiddleware, scheduleController.getScheduleDetail);
router.get('/:id/progress', authMiddleware, scheduleController.getScheduleProgress);
router.post('/exercise/add', authMiddleware, scheduleController.addExercise);
router.post('/exercise/remove', authMiddleware, scheduleController.removeExercise);
router.put('/exercise/update', authMiddleware, scheduleController.updateExercise);
router.delete('/:id', authMiddleware, scheduleController.deleteSchedule);
router.patch('/:id/toggle', authMiddleware, scheduleController.toggleScheduleActive);

module.exports = router;
