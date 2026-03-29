const streakServices = require('../Services/streakServices');

const streakController = {
  getStreak: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const streak = await streakServices.getStreakByUser(iduser);
      
      return res.status(200).json({
        success: true,
        data: streak
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getStreakStats: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const stats = await streakServices.getStreakStats(iduser);
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  maintainStreak: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const result = await streakServices.maintainStreak(iduser);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = streakController;
