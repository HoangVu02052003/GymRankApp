const profileServices = require('../Services/profileServices');

const profileController = {
  getProfile: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const profile = await profileServices.getProfile(iduser);
      
      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { iduser } = req.user;
      const data = req.body;

      const result = await profileServices.updateProfile(iduser, data);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getFullStats: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const stats = await profileServices.getFullStats(iduser);
      
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
  }
};

module.exports = profileController;
