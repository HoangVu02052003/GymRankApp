const wafMiddleware = (req, res, next) => {
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /\.\.\//g,
    /<iframe/gi,
    /eval\(/gi,
    /DROP\s+TABLE/gi,
    /UNION\s+SELECT/gi,
    /;\s*DROP/gi
  ];

  const checkString = (str) => {
    if (typeof str !== 'string') return false;
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      const value = obj[key];
      
      if (typeof value === 'string' && checkString(value)) {
        return true;
      }
      
      if (typeof value === 'object' && value !== null) {
        if (checkObject(value)) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    console.warn('WAF blocked suspicious request:', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });

    return res.status(403).json({
      success: false,
      message: 'Request bị chặn bởi WAF'
    });
  }

  next();
};

module.exports = wafMiddleware;
