const verificationServices = require('../Services/verificationServices');

const verificationController = {
  uploadVideo: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { videourl } = req.body;

      if (!videourl) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập URL video'
        });
      }

      const result = await verificationServices.uploadVideoVerification(iduser, videourl);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getUserVerifications: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { page, limit } = req.query;

      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await verificationServices.getUserVerifications(iduser, options);
      
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

  checkVerificationStatus: async (req, res) => {
    try {
      const { iduser } = req.user;

      const result = await verificationServices.checkVerificationStatus(iduser);
      
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
  }
};

module.exports = verificationController;
