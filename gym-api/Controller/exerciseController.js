const exerciseServices = require('../Services/exerciseServices');

const exerciseController = {
  getAllExercises: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await exerciseServices.getAllExercises(options);
      
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

  getExerciseById: async (req, res) => {
    try {
      const { id } = req.params;

      const exercise = await exerciseServices.getExerciseById(id);
      
      return res.status(200).json({
        success: true,
        data: exercise
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getByMuscleGroup: async (req, res) => {
    try {
      const { nhomco } = req.params;
      const { page, limit } = req.query;

      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await exerciseServices.getExercisesByMuscleGroup(nhomco, options);
      
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

  getByDifficulty: async (req, res) => {
    try {
      const { dokho } = req.params;
      const { page, limit } = req.query;

      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await exerciseServices.getExercisesByDifficulty(dokho, options);
      
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

  searchExercises: async (req, res) => {
    try {
      const { keyword } = req.query;
      const { page, limit } = req.query;

      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập từ khóa tìm kiếm'
        });
      }

      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await exerciseServices.searchExercises(keyword, options);
      
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

  getMuscleGroups: async (req, res) => {
    try {
      const muscleGroups = exerciseServices.getMuscleGroups();
      
      return res.status(200).json({
        success: true,
        data: muscleGroups
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = exerciseController;
