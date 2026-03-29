const streakMethod = require('../Model/Method/StreakMethod');
const expServices = require('./expServices');

const MAX_INACTIVE_DAYS = 5;

const streakServices = {
  getStreakByUser: async (iduser) => {
    try {
      let streak = await streakMethod.readByUser(iduser);
      if (!streak) {
        streak = await streakMethod.create({
          iduser,
          currentstreak: 0,
          longeststreak: 0
        });
      }
      return streak;
    } catch (error) {
      throw error;
    }
  },

  checkAndUpdateStreak: async (iduser) => {
    try {
      const streak = await streakServices.getStreakByUser(iduser);
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const lastActive = new Date(streak.lastactivedate);
      lastActive.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        return {
          success: true,
          message: 'Hôm nay đã cập nhật streak',
          streak
        };
      }

      if (daysDiff > MAX_INACTIVE_DAYS) {
        await expServices.applyStreakPenalty(iduser, daysDiff);

        const updatedStreak = await streakMethod.updateByUser(iduser, {
          currentstreak: 0,
          lastactivedate: now,
          $push: {
            streakhistory: {
              date: now,
              active: false
            }
          }
        });

        return {
          success: false,
          message: `Streak đã bị reset do nghỉ ${daysDiff} ngày (>${MAX_INACTIVE_DAYS} ngày)`,
          penaltyApplied: true,
          expLost: Math.abs(-50 * daysDiff),
          streak: updatedStreak
        };
      }

      return {
        success: true,
        message: 'Streak vẫn được duy trì (trong vòng 5 ngày)',
        streak
      };
    } catch (error) {
      throw error;
    }
  },

  incrementStreak: async (iduser) => {
    try {
      const checkResult = await streakServices.checkAndUpdateStreak(iduser);
      
      if (checkResult.penaltyApplied) {
        return checkResult;
      }

      const streak = checkResult.streak;
      const newStreak = streak.currentstreak + 1;
      const newLongest = Math.max(newStreak, streak.longeststreak);

      const updatedStreak = await streakMethod.updateByUser(iduser, {
        currentstreak: newStreak,
        longeststreak: newLongest,
        lastactivedate: Date.now(),
        $push: {
          streakhistory: {
            date: Date.now(),
            active: true
          }
        }
      });

      return {
        success: true,
        message: `Streak tăng lên ${newStreak} ngày`,
        streak: updatedStreak,
        isNewRecord: newStreak === newLongest && newStreak > 1
      };
    } catch (error) {
      throw error;
    }
  },

  maintainStreak: async (iduser) => {
    try {
      const streak = await streakServices.getStreakByUser(iduser);
      
      const updatedStreak = await streakMethod.updateByUser(iduser, {
        lastactivedate: Date.now(),
        $push: {
          streakhistory: {
            date: Date.now(),
            active: true
          }
        }
      });

      return {
        success: true,
        message: 'Streak được duy trì (ngày nghỉ)',
        streak: updatedStreak
      };
    } catch (error) {
      throw error;
    }
  },

  getStreakStats: async (iduser) => {
    try {
      const streak = await streakServices.getStreakByUser(iduser);
      
      const lastActive = new Date(streak.lastactivedate);
      lastActive.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysSinceActive = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

      return {
        currentstreak: streak.currentstreak,
        longeststreak: streak.longeststreak,
        lastactivedate: streak.lastactivedate,
        daysSinceActive,
        isAtRisk: daysSinceActive > MAX_INACTIVE_DAYS,
        daysUntilReset: Math.max(0, MAX_INACTIVE_DAYS - daysSinceActive)
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = streakServices;
