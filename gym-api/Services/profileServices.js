const userMethod = require('../Model/Method/userMethod');
const thongtinMethod = require('../Model/Method/thongtinMethod');
const expServices = require('./expServices');
const streakServices = require('./streakServices');
const rankServices = require('./rankServices');

const profileServices = {
  getProfile: async (iduser) => {
    try {
      const user = await userMethod.read(iduser);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const exp = await expServices.getExpByUser(iduser);
      const streak = await streakServices.getStreakByUser(iduser);
      const currentRank = await rankServices.getCurrentRank(iduser);
      const rankUpCheck = await rankServices.checkRankUp(iduser);

      return {
        user: {
          id: user._id,
          tk: user.tk
        },
        thongtin: user.idthongtin,
        exp: {
          total: exp.totalexp,
          daily: exp.dailyexp,
          maxDaily: 100
        },
        streak: {
          current: streak.currentstreak,
          longest: streak.longeststreak,
          lastActive: streak.lastactivedate
        },
        rank: {
          current: currentRank,
          canRankUp: rankUpCheck.canRankUp,
          nextRank: rankUpCheck.nextRank,
          expNeeded: rankUpCheck.expNeeded || 0
        }
      };
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (iduser, data) => {
    try {
      const user = await userMethod.read(iduser);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const updatedThongtin = await thongtinMethod.update(user.idthongtin._id, data);

      return {
        success: true,
        message: 'Cập nhật thông tin thành công',
        thongtin: updatedThongtin
      };
    } catch (error) {
      throw error;
    }
  },

  getFullStats: async (iduser) => {
    try {
      const profile = await profileServices.getProfile(iduser);
      const streakStats = await streakServices.getStreakStats(iduser);
      const expHistory = await expServices.getExpHistory(iduser, { limit: 10 });

      return {
        ...profile,
        streakStats,
        recentExpHistory: expHistory
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = profileServices;
