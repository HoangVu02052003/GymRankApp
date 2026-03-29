const expMethod = require('../Model/Method/expMethod');
const historyExpMethod = require('../Model/Method/historyExpMethod');

const MAX_DAILY_EXP = 100;
const STREAK_PENALTY = -50;

const expServices = {
  getExpByUser: async (iduser) => {
    try {
      const exp = await expMethod.readByUser(iduser);
      if (!exp) {
        throw new Error('Không tìm thấy thông tin EXP');
      }
      return exp;
    } catch (error) {
      throw error;
    }
  },

  checkAndResetDailyExp: async (iduser) => {
    try {
      const exp = await expMethod.readByUser(iduser);
      if (!exp) {
        throw new Error('Không tìm thấy thông tin EXP');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = new Date(exp.lastexpreset);
      lastReset.setHours(0, 0, 0, 0);

      if (today > lastReset) {
        await expMethod.resetDailyExp(iduser);
        return { reset: true, message: 'Daily EXP đã được reset' };
      }

      return { reset: false, message: 'Daily EXP chưa cần reset' };
    } catch (error) {
      throw error;
    }
  },

  addExp: async (iduser, amount, reason, details = '') => {
    try {
      await expServices.checkAndResetDailyExp(iduser);

      const exp = await expMethod.readByUser(iduser);
      if (!exp) {
        throw new Error('Không tìm thấy thông tin EXP');
      }

      if (reason === 'workout_completed' && exp.dailyexp >= MAX_DAILY_EXP) {
        return {
          success: false,
          message: 'Đã đạt giới hạn EXP hàng ngày (100 EXP)',
          currentExp: exp
        };
      }

      let actualAmount = amount;
      if (reason === 'workout_completed') {
        const remaining = MAX_DAILY_EXP - exp.dailyexp;
        actualAmount = Math.min(amount, remaining);
      }

      const updatedExp = await expMethod.incrementExp(iduser, actualAmount);

      await historyExpMethod.create({
        iduser,
        expchange: actualAmount,
        reason,
        details: details || `Cộng ${actualAmount} EXP từ ${reason}`
      });

      return {
        success: true,
        message: `Cộng ${actualAmount} EXP thành công`,
        expAdded: actualAmount,
        currentExp: updatedExp
      };
    } catch (error) {
      throw error;
    }
  },

  subtractExp: async (iduser, amount, reason, details = '') => {
    try {
      const exp = await expMethod.readByUser(iduser);
      if (!exp) {
        throw new Error('Không tìm thấy thông tin EXP');
      }

      const newTotalExp = Math.max(0, exp.totalexp - amount);
      const updatedExp = await expMethod.updateByUser(iduser, {
        totalexp: newTotalExp,
        lastupdated: Date.now()
      });

      await historyExpMethod.create({
        iduser,
        expchange: -amount,
        reason,
        details: details || `Trừ ${amount} EXP từ ${reason}`
      });

      return {
        success: true,
        message: `Trừ ${amount} EXP thành công`,
        expSubtracted: amount,
        currentExp: updatedExp
      };
    } catch (error) {
      throw error;
    }
  },

  applyStreakPenalty: async (iduser, daysInactive) => {
    try {
      const penaltyAmount = STREAK_PENALTY * daysInactive;
      return await expServices.subtractExp(
        iduser,
        Math.abs(penaltyAmount),
        'streak_penalty',
        `Nghỉ ${daysInactive} ngày, trừ ${Math.abs(penaltyAmount)} EXP`
      );
    } catch (error) {
      throw error;
    }
  },

  getExpHistory: async (iduser, options = {}) => {
    try {
      return await historyExpMethod.readByUser(iduser, options);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = expServices;
