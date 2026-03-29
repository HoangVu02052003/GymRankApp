const AIServices = require('../Services/AIServices');

const AIController = {
  generateWorkoutPlan: async (req, res) => {
    try {
      const { iduser } = req.user;
      const preferences = req.body;

      if (!preferences.days || !preferences.level) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập số ngày tập và trình độ'
        });
      }

      const result = await AIServices.generateWorkoutPlan(iduser, preferences);
      
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getRequiredInputs: async (req, res) => {
    try {
      const inputs = AIServices.getRequiredInputs();
      
      return res.status(200).json({
        success: true,
        data: inputs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = AIController;
