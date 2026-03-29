const lichTrinhMethod = require('../Model/Method/LichTrinhMethod');
const chiTietLichTrinhMethod = require('../Model/Method/ChiTietLichTrinhMethod');
const baitapMethod = require('../Model/Method/baitapMethod');

const setupLichServices = {
  createCustomSchedule: async (iduser, tenlich, loailich = 'custom') => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich,
        loailich,
        createdby: 'user',
        active: true
      });

      return {
        success: true,
        message: 'Tạo lịch tập thành công',
        lichTrinh
      };
    } catch (error) {
      throw error;
    }
  },

  addExerciseToSchedule: async (idLichTrinh, idbaitap, sets, reps, date, ghichu = '') => {
    try {
      const lichTrinh = await lichTrinhMethod.read(idLichTrinh);
      if (!lichTrinh) {
        throw new Error('Lịch tập không tồn tại');
      }

      const baitap = await baitapMethod.read(idbaitap);
      if (!baitap) {
        throw new Error('Bài tập không tồn tại');
      }

      const chiTiet = await chiTietLichTrinhMethod.create({
        idbaitap,
        sets,
        reps,
        date,
        ghichu
      });

      await lichTrinhMethod.addChiTiet(idLichTrinh, chiTiet._id);

      return {
        success: true,
        message: 'Thêm bài tập vào lịch thành công',
        chiTiet
      };
    } catch (error) {
      throw error;
    }
  },

  removeExerciseFromSchedule: async (idLichTrinh, idChiTiet) => {
    try {
      await lichTrinhMethod.removeChiTiet(idLichTrinh, idChiTiet);
      await chiTietLichTrinhMethod.delete(idChiTiet);

      return {
        success: true,
        message: 'Xóa bài tập khỏi lịch thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  updateExerciseInSchedule: async (idChiTiet, data) => {
    try {
      const chiTiet = await chiTietLichTrinhMethod.update(idChiTiet, data);
      return {
        success: true,
        message: 'Cập nhật bài tập thành công',
        chiTiet
      };
    } catch (error) {
      throw error;
    }
  },

  getScheduleDetail: async (idLichTrinh) => {
    try {
      const lichTrinh = await lichTrinhMethod.read(idLichTrinh);
      if (!lichTrinh) {
        throw new Error('Lịch tập không tồn tại');
      }

      const completed = lichTrinh.idChiTiet.filter(ct => ct.trangthai).length;
      const total = lichTrinh.idChiTiet.length;

      return {
        lichTrinh,
        stats: {
          total,
          completed,
          remaining: total - completed,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      };
    } catch (error) {
      throw error;
    }
  },

  getUserSchedules: async (iduser, options = {}) => {
    try {
      return await lichTrinhMethod.readByUser(iduser, options);
    } catch (error) {
      throw error;
    }
  },

  deleteSchedule: async (idLichTrinh) => {
    try {
      const lichTrinh = await lichTrinhMethod.read(idLichTrinh);
      if (!lichTrinh) {
        throw new Error('Lịch tập không tồn tại');
      }

      for (const idChiTiet of lichTrinh.idChiTiet) {
        await chiTietLichTrinhMethod.delete(idChiTiet);
      }

      await lichTrinhMethod.delete(idLichTrinh);

      return {
        success: true,
        message: 'Xóa lịch tập thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  toggleScheduleActive: async (idLichTrinh, active) => {
    try {
      const lichTrinh = await lichTrinhMethod.update(idLichTrinh, { active });
      return {
        success: true,
        message: active ? 'Kích hoạt lịch tập' : 'Tắt lịch tập',
        lichTrinh
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = setupLichServices;
