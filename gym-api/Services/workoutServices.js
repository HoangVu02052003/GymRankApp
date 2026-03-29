const chiTietLichTrinhMethod = require('../Model/Method/ChiTietLichTrinhMethod');
const lichTrinhMethod = require('../Model/Method/LichTrinhMethod');
const expServices = require('./expServices');
const streakServices = require('./streakServices');

const EXP_PER_EXERCISE = 100;

const workoutServices = {
  completeExercise: async (iduser, idChiTiet) => {
    try {
      const chiTiet = await chiTietLichTrinhMethod.read(idChiTiet);
      if (!chiTiet) {
        throw new Error('Không tìm thấy bài tập');
      }

      if (chiTiet.trangthai) {
        return {
          success: false,
          message: 'Bài tập đã được hoàn thành trước đó',
          chiTiet
        };
      }

      const updatedChiTiet = await chiTietLichTrinhMethod.markCompleted(idChiTiet);

      const expResult = await expServices.addExp(
        iduser,
        EXP_PER_EXERCISE,
        'workout_completed',
        `Hoàn thành bài tập: ${updatedChiTiet.idbaitap?.tenbaitap || 'Unknown'}`
      );

      return {
        success: true,
        message: 'Hoàn thành bài tập',
        chiTiet: updatedChiTiet,
        expResult
      };
    } catch (error) {
      throw error;
    }
  },

  getTodayWorkout: async (iduser) => {
    try {
      const today = new Date();
      const lichTrinhs = await lichTrinhMethod.readByUser(iduser, { activeOnly: true });

      const todayWorkouts = [];
      for (const lich of lichTrinhs.data) {
        for (const chiTiet of lich.idChiTiet) {
          const chiTietDate = new Date(chiTiet.date);
          if (
            chiTietDate.getDate() === today.getDate() &&
            chiTietDate.getMonth() === today.getMonth() &&
            chiTietDate.getFullYear() === today.getFullYear()
          ) {
            todayWorkouts.push({
              ...chiTiet.toObject(),
              lichTrinh: {
                id: lich._id,
                tenlich: lich.tenlich,
                loailich: lich.loailich
              }
            });
          }
        }
      }

      const completed = todayWorkouts.filter(w => w.trangthai).length;
      const total = todayWorkouts.length;
      const expEarned = completed * EXP_PER_EXERCISE;

      return {
        date: today,
        workouts: todayWorkouts,
        stats: {
          total,
          completed,
          remaining: total - completed,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
          expEarned
        }
      };
    } catch (error) {
      throw error;
    }
  },

  getWorkoutHistory: async (iduser, options = {}) => {
    try {
      const lichTrinhs = await lichTrinhMethod.readByUser(iduser, options);
      return lichTrinhs;
    } catch (error) {
      throw error;
    }
  },

  updateWorkoutProgress: async (iduser) => {
    try {
      const today = await workoutServices.getTodayWorkout(iduser);
      
      if (today.stats.completed > 0) {
        await streakServices.incrementStreak(iduser);
      }

      return {
        success: true,
        todayProgress: today
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = workoutServices;
