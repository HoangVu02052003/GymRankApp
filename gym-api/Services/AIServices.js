const lichTrinhMethod = require('../Model/Method/LichTrinhMethod');
const chiTietLichTrinhMethod = require('../Model/Method/ChiTietLichTrinhMethod');
const baitapMethod = require('../Model/Method/baitapMethod');
const thongtinMethod = require('../Model/Method/thongtinMethod');

const AIServices = {
  generateWorkoutPlan: async (iduser, preferences) => {
    try {
      const {
        days = 3,
        level = 'beginner',
        goal = 'general',
        equipment = [],
        focusAreas = [],
        duration = 60
      } = preferences;

      const user = await thongtinMethod.readOne({ _id: iduser });
      if (!user) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      let workoutType = 'fullbody';
      if (days >= 4) {
        workoutType = 'push_pull_leg';
      } else if (days === 3) {
        workoutType = 'upper_lower';
      }

      const plan = await AIServices.createPlanBasedOnType(
        iduser,
        workoutType,
        level,
        focusAreas,
        days
      );

      return {
        success: true,
        message: 'AI đã tạo lịch tập thành công',
        plan,
        recommendations: AIServices.getRecommendations(user, preferences)
      };
    } catch (error) {
      throw error;
    }
  },

  createPlanBasedOnType: async (iduser, type, level, focusAreas, days) => {
    try {
      const schedules = [];

      if (type === 'push_pull_leg') {
        const pushSchedule = await AIServices.createPushDay(iduser, level);
        const pullSchedule = await AIServices.createPullDay(iduser, level);
        const legSchedule = await AIServices.createLegDay(iduser, level);
        
        schedules.push(pushSchedule, pullSchedule, legSchedule);
        
        if (days > 3) {
          for (let i = 3; i < days; i++) {
            const cycleDay = [pushSchedule, pullSchedule, legSchedule][i % 3];
            schedules.push(cycleDay);
          }
        }
      } else if (type === 'upper_lower') {
        const upperSchedule = await AIServices.createUpperDay(iduser, level);
        const lowerSchedule = await AIServices.createLowerDay(iduser, level);
        
        schedules.push(upperSchedule, lowerSchedule);
        
        if (days > 2) {
          schedules.push(upperSchedule);
        }
      } else {
        for (let i = 0; i < days; i++) {
          const fullbodySchedule = await AIServices.createFullBodyDay(iduser, level);
          schedules.push(fullbodySchedule);
        }
      }

      return {
        type,
        days,
        schedules
      };
    } catch (error) {
      throw error;
    }
  },

  createPushDay: async (iduser, level) => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich: 'Push Day (AI)',
        loailich: 'push',
        createdby: 'ai',
        active: true
      });

      const chestExercises = await baitapMethod.readByNhomCo('Ngực', { limit: 3 });
      const shoulderExercises = await baitapMethod.readByNhomCo('Vai', { limit: 2 });
      const tricepsExercises = await baitapMethod.readByNhomCo('Tay sau', { limit: 2 });

      const exercises = [
        ...chestExercises.data,
        ...shoulderExercises.data,
        ...tricepsExercises.data
      ];

      const today = new Date();
      for (const ex of exercises) {
        const chiTiet = await chiTietLichTrinhMethod.create({
          idbaitap: ex._id,
          sets: level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5,
          reps: level === 'beginner' ? '10-12' : level === 'intermediate' ? '8-10' : '6-8',
          date: today
        });

        await lichTrinhMethod.addChiTiet(lichTrinh._id, chiTiet._id);
      }

      return await lichTrinhMethod.read(lichTrinh._id);
    } catch (error) {
      throw error;
    }
  },

  createPullDay: async (iduser, level) => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich: 'Pull Day (AI)',
        loailich: 'pull',
        createdby: 'ai',
        active: true
      });

      const backExercises = await baitapMethod.readByNhomCo('Lưng', { limit: 3 });
      const bicepsExercises = await baitapMethod.readByNhomCo('Tay trước', { limit: 2 });
      const rearDeltExercises = await baitapMethod.readByNhomCo('Vai sau', { limit: 1 });

      const exercises = [
        ...backExercises.data,
        ...bicepsExercises.data,
        ...rearDeltExercises.data
      ];

      const today = new Date();
      for (const ex of exercises) {
        const chiTiet = await chiTietLichTrinhMethod.create({
          idbaitap: ex._id,
          sets: level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5,
          reps: level === 'beginner' ? '10-12' : level === 'intermediate' ? '8-10' : '6-8',
          date: today
        });

        await lichTrinhMethod.addChiTiet(lichTrinh._id, chiTiet._id);
      }

      return await lichTrinhMethod.read(lichTrinh._id);
    } catch (error) {
      throw error;
    }
  },

  createLegDay: async (iduser, level) => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich: 'Leg Day (AI)',
        loailich: 'leg',
        createdby: 'ai',
        active: true
      });

      const quadExercises = await baitapMethod.readByNhomCo('Chân trước', { limit: 2 });
      const hamstringExercises = await baitapMethod.readByNhomCo('Chân sau', { limit: 2 });
      const gluteExercises = await baitapMethod.readByNhomCo('Mông', { limit: 1 });
      const calfExercises = await baitapMethod.readByNhomCo('Bắp chân', { limit: 1 });

      const exercises = [
        ...quadExercises.data,
        ...hamstringExercises.data,
        ...gluteExercises.data,
        ...calfExercises.data
      ];

      const today = new Date();
      for (const ex of exercises) {
        const chiTiet = await chiTietLichTrinhMethod.create({
          idbaitap: ex._id,
          sets: level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5,
          reps: level === 'beginner' ? '12-15' : level === 'intermediate' ? '10-12' : '8-10',
          date: today
        });

        await lichTrinhMethod.addChiTiet(lichTrinh._id, chiTiet._id);
      }

      return await lichTrinhMethod.read(lichTrinh._id);
    } catch (error) {
      throw error;
    }
  },

  createUpperDay: async (iduser, level) => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich: 'Upper Body (AI)',
        loailich: 'custom',
        createdby: 'ai',
        active: true
      });

      const chestExercises = await baitapMethod.readByNhomCo('Ngực', { limit: 2 });
      const backExercises = await baitapMethod.readByNhomCo('Lưng', { limit: 2 });
      const shoulderExercises = await baitapMethod.readByNhomCo('Vai', { limit: 2 });
      const armExercises = await baitapMethod.readByNhomCo('Tay trước', { limit: 1 });

      const exercises = [
        ...chestExercises.data,
        ...backExercises.data,
        ...shoulderExercises.data,
        ...armExercises.data
      ];

      const today = new Date();
      for (const ex of exercises) {
        const chiTiet = await chiTietLichTrinhMethod.create({
          idbaitap: ex._id,
          sets: level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5,
          reps: level === 'beginner' ? '10-12' : level === 'intermediate' ? '8-10' : '6-8',
          date: today
        });

        await lichTrinhMethod.addChiTiet(lichTrinh._id, chiTiet._id);
      }

      return await lichTrinhMethod.read(lichTrinh._id);
    } catch (error) {
      throw error;
    }
  },

  createLowerDay: async (iduser, level) => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich: 'Lower Body (AI)',
        loailich: 'leg',
        createdby: 'ai',
        active: true
      });

      const quadExercises = await baitapMethod.readByNhomCo('Chân trước', { limit: 2 });
      const hamstringExercises = await baitapMethod.readByNhomCo('Chân sau', { limit: 2 });
      const gluteExercises = await baitapMethod.readByNhomCo('Mông', { limit: 1 });

      const exercises = [
        ...quadExercises.data,
        ...hamstringExercises.data,
        ...gluteExercises.data
      ];

      const today = new Date();
      for (const ex of exercises) {
        const chiTiet = await chiTietLichTrinhMethod.create({
          idbaitap: ex._id,
          sets: level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5,
          reps: level === 'beginner' ? '12-15' : level === 'intermediate' ? '10-12' : '8-10',
          date: today
        });

        await lichTrinhMethod.addChiTiet(lichTrinh._id, chiTiet._id);
      }

      return await lichTrinhMethod.read(lichTrinh._id);
    } catch (error) {
      throw error;
    }
  },

  createFullBodyDay: async (iduser, level) => {
    try {
      const lichTrinh = await lichTrinhMethod.create({
        iduser,
        tenlich: 'Full Body (AI)',
        loailich: 'fullbody',
        createdby: 'ai',
        active: true
      });

      const chestExercises = await baitapMethod.readByNhomCo('Ngực', { limit: 1 });
      const backExercises = await baitapMethod.readByNhomCo('Lưng', { limit: 1 });
      const legExercises = await baitapMethod.readByNhomCo('Chân trước', { limit: 2 });
      const shoulderExercises = await baitapMethod.readByNhomCo('Vai', { limit: 1 });

      const exercises = [
        ...chestExercises.data,
        ...backExercises.data,
        ...legExercises.data,
        ...shoulderExercises.data
      ];

      const today = new Date();
      for (const ex of exercises) {
        const chiTiet = await chiTietLichTrinhMethod.create({
          idbaitap: ex._id,
          sets: level === 'beginner' ? 3 : 4,
          reps: '10-12',
          date: today
        });

        await lichTrinhMethod.addChiTiet(lichTrinh._id, chiTiet._id);
      }

      return await lichTrinhMethod.read(lichTrinh._id);
    } catch (error) {
      throw error;
    }
  },

  getRecommendations: (userInfo, preferences) => {
    const recommendations = [];

    if (!userInfo.cannang || !userInfo.chieucao) {
      recommendations.push('Cập nhật cân nặng và chiều cao để có lịch tập chính xác hơn');
    }

    if (preferences.level === 'beginner') {
      recommendations.push('Tập trung vào form chuẩn trước khi tăng trọng lượng');
      recommendations.push('Nghỉ 48-72 giờ giữa các buổi tập cho nhóm cơ');
    }

    if (preferences.days > 5) {
      recommendations.push('Cân nhắc thêm ngày nghỉ để cơ thể phục hồi');
    }

    if (preferences.goal === 'weight_loss') {
      recommendations.push('Kết hợp cardio và kiểm soát calories để giảm cân hiệu quả');
    } else if (preferences.goal === 'muscle_gain') {
      recommendations.push('Tăng protein và ăn thừa calories để tăng cơ');
    }

    return recommendations;
  },

  getRequiredInputs: () => {
    return {
      required: [
        {
          field: 'days',
          type: 'number',
          description: 'Số ngày tập trong tuần (1-7)',
          example: 4
        },
        {
          field: 'level',
          type: 'string',
          description: 'Trình độ tập luyện',
          options: ['beginner', 'intermediate', 'advanced'],
          example: 'intermediate'
        }
      ],
      optional: [
        {
          field: 'goal',
          type: 'string',
          description: 'Mục tiêu tập luyện',
          options: ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general'],
          example: 'muscle_gain'
        },
        {
          field: 'equipment',
          type: 'array',
          description: 'Thiết bị có sẵn',
          example: ['Barbell', 'Dumbbell', 'Machine']
        },
        {
          field: 'focusAreas',
          type: 'array',
          description: 'Nhóm cơ muốn tập trung',
          example: ['Ngực', 'Lưng', 'Chân']
        },
        {
          field: 'duration',
          type: 'number',
          description: 'Thời gian tập mỗi buổi (phút)',
          example: 60
        },
        {
          field: 'injuries',
          type: 'array',
          description: 'Các chấn thương cần tránh',
          example: ['Đau lưng', 'Đau vai']
        },
        {
          field: 'preferences',
          type: 'object',
          description: 'Sở thích cá nhân',
          example: {
            preferCompound: true,
            avoidCardio: false,
            preferFreeWeight: true
          }
        }
      ]
    };
  }
};

module.exports = AIServices;
