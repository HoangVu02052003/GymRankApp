const rankServices = require('../Services/rankServices');

const rankController = {
  getAllRanks: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const ranks = await rankServices.getAllRanks(options);
      
      return res.status(200).json({
        success: true,
        data: ranks
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getCurrentRank: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const rank = await rankServices.getCurrentRank(iduser);
      
      return res.status(200).json({
        success: true,
        data: rank
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  checkRankUp: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const result = await rankServices.checkRankUp(iduser);
      
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

  rankUp: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const result = await rankServices.rankUp(iduser);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createTest: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { idrank, numQuestions = 10 } = req.body;

      if (!idrank) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn rank'
        });
      }

      const result = await rankServices.createTest(iduser, idrank, numQuestions);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  submitTest: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { idrank, answers } = req.body;

      if (!idrank || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ'
        });
      }

      const result = await rankServices.submitTest(iduser, idrank, answers);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = rankController;
