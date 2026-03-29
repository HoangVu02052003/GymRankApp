const authServices = require('../Services/authServices');

const authController = {
  register: async (req, res) => {
    try {
      const { tk, matkhau, thongtinData } = req.body;

      if (!tk || !matkhau) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tài khoản và mật khẩu'
        });
      }

      const result = await authServices.register(tk, matkhau, thongtinData);
      
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { tk, matkhau } = req.body;

      if (!tk || !matkhau) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tài khoản và mật khẩu'
        });
      }

      const result = await authServices.login(tk, matkhau);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { iduser } = req.user;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin'
        });
      }

      const result = await authServices.changePassword(iduser, oldPassword, newPassword);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = authController;
