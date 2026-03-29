const rankMethod = require('../Model/Method/rankMethod');
const baitapMethod = require('../Model/Method/baitapMethod');
const questtionMethod = require('../Model/Method/questtionMethod');
const comfirmMethod = require('../Model/Method/comfirmMethod');
const userMethod = require('../Model/Method/userMethod');
const thongtinMethod = require('../Model/Method/thongtinMethod');
const verificationServices = require('./verificationServices');

const adminServices = {
  createRank: async (data) => {
    try {
      const existingRank = await rankMethod.readOne({ level: data.level });
      if (existingRank) {
        throw new Error('Level này đã tồn tại');
      }

      const rank = await rankMethod.create(data);
      return {
        success: true,
        message: 'Tạo rank thành công',
        rank
      };
    } catch (error) {
      throw error;
    }
  },

  updateRank: async (id, data) => {
    try {
      const rank = await rankMethod.update(id, data);
      if (!rank) {
        throw new Error('Rank không tồn tại');
      }
      return {
        success: true,
        message: 'Cập nhật rank thành công',
        rank
      };
    } catch (error) {
      throw error;
    }
  },

  deleteRank: async (id) => {
    try {
      const rank = await rankMethod.delete(id);
      if (!rank) {
        throw new Error('Rank không tồn tại');
      }
      return {
        success: true,
        message: 'Xóa rank thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  createExercise: async (data) => {
    try {
      const exercise = await baitapMethod.create(data);
      return {
        success: true,
        message: 'Tạo bài tập thành công',
        exercise
      };
    } catch (error) {
      throw error;
    }
  },

  updateExercise: async (id, data) => {
    try {
      const exercise = await baitapMethod.update(id, data);
      if (!exercise) {
        throw new Error('Bài tập không tồn tại');
      }
      return {
        success: true,
        message: 'Cập nhật bài tập thành công',
        exercise
      };
    } catch (error) {
      throw error;
    }
  },

  deleteExercise: async (id) => {
    try {
      const exercise = await baitapMethod.delete(id);
      if (!exercise) {
        throw new Error('Bài tập không tồn tại');
      }
      return {
        success: true,
        message: 'Xóa bài tập thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  createQuestion: async (data) => {
    try {
      const question = await questtionMethod.create(data);
      return {
        success: true,
        message: 'Tạo câu hỏi thành công',
        question
      };
    } catch (error) {
      throw error;
    }
  },

  updateQuestion: async (id, data) => {
    try {
      const question = await questtionMethod.update(id, data);
      if (!question) {
        throw new Error('Câu hỏi không tồn tại');
      }
      return {
        success: true,
        message: 'Cập nhật câu hỏi thành công',
        question
      };
    } catch (error) {
      throw error;
    }
  },

  deleteQuestion: async (id) => {
    try {
      const question = await questtionMethod.delete(id);
      if (!question) {
        throw new Error('Câu hỏi không tồn tại');
      }
      return {
        success: true,
        message: 'Xóa câu hỏi thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async (options = {}) => {
    try {
      return await userMethod.readAll({}, options);
    } catch (error) {
      throw error;
    }
  },

  getUserDetail: async (iduser) => {
    try {
      const user = await userMethod.read(iduser);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  getPendingVerifications: async (options = {}) => {
    try {
      return await verificationServices.getPendingVerifications(options);
    } catch (error) {
      throw error;
    }
  },

  approveVerification: async (idcomfirm, adminNote) => {
    try {
      return await verificationServices.approveVerification(idcomfirm, adminNote);
    } catch (error) {
      throw error;
    }
  },

  rejectVerification: async (idcomfirm, adminNote) => {
    try {
      return await verificationServices.rejectVerification(idcomfirm, adminNote);
    } catch (error) {
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const totalUsers = await userMethod.readAll({}, { limit: 1 });
      const totalRanks = await rankMethod.readAll({}, { limit: 1 });
      const totalExercises = await baitapMethod.readAll({}, { limit: 1 });
      const totalQuestions = await questtionMethod.readAll({}, { limit: 1 });
      const pendingVerifications = await comfirmMethod.readByStatus('pending', { limit: 1 });

      return {
        success: true,
        statistics: {
          totalUsers: totalUsers.pagination.total,
          totalRanks: totalRanks.pagination.total,
          totalExercises: totalExercises.pagination.total,
          totalQuestions: totalQuestions.pagination.total,
          pendingVerifications: pendingVerifications.pagination.total
        }
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = adminServices;
