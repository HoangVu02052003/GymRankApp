const lichTrinhMethod = require('../Model/Method/LichTrinhMethod');
const chiTietLichTrinhMethod = require('../Model/Method/ChiTietLichTrinhMethod');

const scheduleServices = {
  getActiveSchedules: async (iduser) => {
    try {
      return await lichTrinhMethod.readByUser(iduser, { activeOnly: true });
    } catch (error) {
      throw error;
    }
  },

  getAllSchedules: async (iduser, options = {}) => {
    try {
      return await lichTrinhMethod.readByUser(iduser, options);
    } catch (error) {
      throw error;
    }
  },

  getScheduleById: async (idLichTrinh) => {
    try {
      const lichTrinh = await lichTrinhMethod.read(idLichTrinh);
      if (!lichTrinh) {
        throw new Error('Lịch tập không tồn tại');
      }
      return lichTrinh;
    } catch (error) {
      throw error;
    }
  },

  getTodaySchedule: async (iduser) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const allSchedules = await lichTrinhMethod.readByUser(iduser, { activeOnly: true });
      const todayWorkouts = [];

      for (const schedule of allSchedules.data) {
        const todayExercises = schedule.idChiTiet.filter(chiTiet => {
          const exerciseDate = new Date(chiTiet.date);
          return exerciseDate >= today && exerciseDate <= endOfDay;
        });

        if (todayExercises.length > 0) {
          todayWorkouts.push({
            schedule: {
              id: schedule._id,
              tenlich: schedule.tenlich,
              loailich: schedule.loailich
            },
            exercises: todayExercises
          });
        }
      }

      const totalExercises = todayWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
      const completedExercises = todayWorkouts.reduce(
        (sum, w) => sum + w.exercises.filter(e => e.trangthai).length,
        0
      );

      return {
        date: today,
        workouts: todayWorkouts,
        stats: {
          total: totalExercises,
          completed: completedExercises,
          remaining: totalExercises - completedExercises,
          completionRate: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
        }
      };
    } catch (error) {
      throw error;
    }
  },

  getWeekSchedule: async (iduser, startDate = new Date()) => {
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const weekSchedule = [];

      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999);

        const allSchedules = await lichTrinhMethod.readByUser(iduser, { activeOnly: true });
        const dayWorkouts = [];

        for (const schedule of allSchedules.data) {
          const dayExercises = schedule.idChiTiet.filter(chiTiet => {
            const exerciseDate = new Date(chiTiet.date);
            return exerciseDate >= day && exerciseDate <= endOfDay;
          });

          if (dayExercises.length > 0) {
            dayWorkouts.push({
              schedule: {
                id: schedule._id,
                tenlich: schedule.tenlich,
                loailich: schedule.loailich
              },
              exercises: dayExercises
            });
          }
        }

        weekSchedule.push({
          date: day,
          dayOfWeek: day.toLocaleDateString('vi-VN', { weekday: 'long' }),
          workouts: dayWorkouts,
          totalExercises: dayWorkouts.reduce((sum, w) => sum + w.exercises.length, 0)
        });
      }

      return {
        startDate: start,
        endDate: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000),
        schedule: weekSchedule
      };
    } catch (error) {
      throw error;
    }
  },

  getScheduleProgress: async (idLichTrinh) => {
    try {
      const lichTrinh = await lichTrinhMethod.read(idLichTrinh);
      if (!lichTrinh) {
        throw new Error('Lịch tập không tồn tại');
      }

      const total = lichTrinh.idChiTiet.length;
      const completed = lichTrinh.idChiTiet.filter(ct => ct.trangthai).length;
      const pending = total - completed;

      const byDate = {};
      lichTrinh.idChiTiet.forEach(ct => {
        const dateKey = new Date(ct.date).toISOString().split('T')[0];
        if (!byDate[dateKey]) {
          byDate[dateKey] = { total: 0, completed: 0 };
        }
        byDate[dateKey].total++;
        if (ct.trangthai) byDate[dateKey].completed++;
      });

      return {
        lichTrinh: {
          id: lichTrinh._id,
          tenlich: lichTrinh.tenlich,
          loailich: lichTrinh.loailich
        },
        stats: {
          total,
          completed,
          pending,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        },
        progressByDate: byDate
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = scheduleServices;
