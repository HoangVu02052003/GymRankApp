const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID không hợp lệ'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu đã tồn tại',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token đã hết hạn'
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Lỗi server'
  });
};

module.exports = errorHandler;
