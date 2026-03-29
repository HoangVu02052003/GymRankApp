const expServices = require('../Services/expServices');

const expController = {
  getExp: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const exp = await expServices.getExpByUser(iduser);
      
      return res.status(200).json({
        success: true,
        data: exp
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getExpHistory: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { page, limit } = req.query;

      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const result = await expServices.getExpHistory(iduser, options);
      
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

module.exports = expController;
