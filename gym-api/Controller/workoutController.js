const workoutServices = require('../Services/workoutServices');

const workoutController = {
  completeExercise: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { idChiTiet } = req.body;

      if (!idChiTiet) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn bài tập'
        });
      }

      const result = await workoutServices.completeExercise(iduser, idChiTiet);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getTodayWorkout: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const result = await workoutServices.getTodayWorkout(iduser);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getWorkoutHistory: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { page, limit } = req.query;
      
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await workoutServices.getWorkoutHistory(iduser, options);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateWorkoutProgress: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const result = await workoutServices.updateWorkoutProgress(iduser);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = workoutController;
