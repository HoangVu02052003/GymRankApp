const baitapMethod = require('../Model/Method/baitapMethod');

const exerciseServices = {
  getAllExercises: async (options = {}) => {
    try {
      return await baitapMethod.readAll({}, options);
    } catch (error) {
      throw error;
    }
  },

  getExerciseById: async (id) => {
    try {
      const exercise = await baitapMethod.read(id);
      if (!exercise) {
        throw new Error('Bài tập không tồn tại');
      }
      return exercise;
    } catch (error) {
      throw error;
    }
  },

  getExercisesByMuscleGroup: async (nhomco, options = {}) => {
    try {
      return await baitapMethod.readByNhomCo(nhomco, options);
    } catch (error) {
      throw error;
    }
  },

  getExercisesByDifficulty: async (dokho, options = {}) => {
    try {
      return await baitapMethod.readByDifficulty(dokho, options);
    } catch (error) {
      throw error;
    }
  },

  searchExercises: async (keyword, options = {}) => {
    try {
      return await baitapMethod.search(keyword, options);
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
      await baitapMethod.delete(id);
      return {
        success: true,
        message: 'Xóa bài tập thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  getMuscleGroups: () => {
    return [
      'Ngực',
      'Lưng',
      'Vai',
      'Vai sau',
      'Tay trước',
      'Tay sau',
      'Chân trước',
      'Chân sau',
      'Mông',
      'Bắp chân',
      'Bụng',
      'Lưng dưới'
    ];
  }
};

module.exports = exerciseServices;
