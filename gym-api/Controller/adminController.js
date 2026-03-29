const adminServices = require('../Services/adminServices');
const rankMethod = require('../Model/Method/rankMethod');
const baitapMethod = require('../Model/Method/baitapMethod');
const questtionMethod = require('../Model/Method/questtionMethod');

const adminController = {
  getStatistics: async (req, res) => {
    try {
      const result = await adminServices.getStatistics();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createRank: async (req, res) => {
    try {
      const result = await adminServices.createRank(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateRank: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminServices.updateRank(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteRank: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminServices.deleteRank(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllRanks: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const ranks = await rankMethod.readAll({}, options);
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

  createExercise: async (req, res) => {
    try {
      const result = await adminServices.createExercise(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateExercise: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminServices.updateExercise(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteExercise: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminServices.deleteExercise(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllExercises: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const exercises = await baitapMethod.readAll({}, options);
      return res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const result = await adminServices.createQuestion(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminServices.updateQuestion(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminServices.deleteQuestion(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllQuestions: async (req, res) => {
    try {
      const { page, limit, idrank } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const filter = idrank ? { idrank } : {};
      const questions = await questtionMethod.readAll(filter, options);
      
      return res.status(200).json({
        success: true,
        data: questions
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const users = await adminServices.getAllUsers(options);
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getUserDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await adminServices.getUserDetail(id);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getPendingVerifications: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);

      const verifications = await adminServices.getPendingVerifications(options);
      return res.status(200).json({
        success: true,
        data: verifications
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  approveVerification: async (req, res) => {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;

      const result = await adminServices.approveVerification(id, adminNote);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  rejectVerification: async (req, res) => {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;

      const result = await adminServices.rejectVerification(id, adminNote);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = adminController;
