const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userMethod = require('../Model/Method/userMethod');
const thongtinMethod = require('../Model/Method/thongtinMethod');
const expMethod = require('../Model/Method/expMethod');
const streakMethod = require('../Model/Method/StreakMethod');

const authServices = {
  register: async (tk, matkhau, thongtinData = {}) => {
    try {
      const existingUser = await userMethod.exists({ tk });
      if (existingUser) {
        throw new Error('Tài khoản đã tồn tại');
      }

      const hashedPassword = await bcrypt.hash(matkhau, 10);

      const thongtin = await thongtinMethod.create(thongtinData);

      const user = await userMethod.create({
        tk,
        matkhau: hashedPassword,
        idthongtin: thongtin._id
      });

      await expMethod.create({
        iduser: user._id,
        totalexp: 0,
        dailyexp: 0
      });

      await streakMethod.create({
        iduser: user._id,
        currentstreak: 0,
        longeststreak: 0
      });

      const token = jwt.sign(
        { id: user._id, tk: user.tk },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return {
        success: true,
        token,
        user: {
          id: user._id,
          tk: user.tk,
          thongtin
        }
      };
    } catch (error) {
      throw error;
    }
  },

  login: async (tk, matkhau) => {
    try {
      const user = await userMethod.readOne({ tk });
      if (!user) {
        throw new Error('Tài khoản không tồn tại');
      }

      const isMatch = await bcrypt.compare(matkhau, user.matkhau);
      if (!isMatch) {
        throw new Error('Mật khẩu không đúng');
      }

      const token = jwt.sign(
        { id: user._id, tk: user.tk },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return {
        success: true,
        token,
        user: {
          id: user._id,
          tk: user.tk,
          thongtin: user.idthongtin
        }
      };
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (iduser, oldPassword, newPassword) => {
    try {
      const user = await userMethod.read(iduser);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.matkhau);
      if (!isMatch) {
        throw new Error('Mật khẩu cũ không đúng');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userMethod.update(iduser, { matkhau: hashedPassword });

      return {
        success: true,
        message: 'Đổi mật khẩu thành công'
      };
    } catch (error) {
      throw error;
    }
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token không hợp lệ');
    }
  }
};

module.exports = authServices;
