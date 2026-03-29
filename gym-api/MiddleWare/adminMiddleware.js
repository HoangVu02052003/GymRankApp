const jwt = require('jsonwebtoken');
const userMethod = require('../Model/Method/userMethod');

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userMethod.read(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập tính năng này'
      });
    }

    req.user = {
      iduser: decoded.id,
      tk: decoded.tk,
      isAdmin: user.isAdmin
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = adminMiddleware;
