const setupLichServices = require('../Services/setupLichServices');
const scheduleServices = require('../Services/scheduleServices');

const scheduleController = {
  createSchedule: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { tenlich, loailich } = req.body;

      if (!tenlich) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tên lịch tập'
        });
      }

      const result = await setupLichServices.createCustomSchedule(iduser, tenlich, loailich);
      
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  addExercise: async (req, res) => {
    try {
      const { idLichTrinh, idbaitap, sets, reps, date, ghichu } = req.body;

      if (!idLichTrinh || !idbaitap) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin'
        });
      }

      const result = await setupLichServices.addExerciseToSchedule(
        idLichTrinh,
        idbaitap,
        sets || 3,
        reps || '8-12',
        date || new Date(),
        ghichu
      );
      
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  removeExercise: async (req, res) => {
    try {
      const { idLichTrinh, idChiTiet } = req.body;

      if (!idLichTrinh || !idChiTiet) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin'
        });
      }

      const result = await setupLichServices.removeExerciseFromSchedule(idLichTrinh, idChiTiet);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateExercise: async (req, res) => {
    try {
      const { idChiTiet, ...data } = req.body;

      if (!idChiTiet) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn bài tập'
        });
      }

      const result = await setupLichServices.updateExerciseInSchedule(idChiTiet, data);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getScheduleDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await setupLichServices.getScheduleDetail(id);
      
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

  getUserSchedules: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { page, limit, activeOnly } = req.query;

      const options = {};
      if (page) options.page = parseInt(page);
      if (limit) options.limit = parseInt(limit);
      if (activeOnly) options.activeOnly = activeOnly === 'true';

      const result = await setupLichServices.getUserSchedules(iduser, options);
      
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

  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await setupLichServices.deleteSchedule(id);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  toggleScheduleActive: async (req, res) => {
    try {
      const { id } = req.params;
      const { active } = req.body;

      if (active === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn trạng thái'
        });
      }

      const result = await setupLichServices.toggleScheduleActive(id, active);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getTodaySchedule: async (req, res) => {
    try {
      const { iduser } = req.user;
      
      const result = await scheduleServices.getTodaySchedule(iduser);
      
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

  getWeekSchedule: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { startDate } = req.query;

      const start = startDate ? new Date(startDate) : new Date();
      const result = await scheduleServices.getWeekSchedule(iduser, start);
      
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

  getScheduleProgress: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await scheduleServices.getScheduleProgress(id);
      
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

module.exports = scheduleController;
