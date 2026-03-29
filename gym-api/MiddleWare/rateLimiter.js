const rateLimitStore = new Map();

const rateLimiter = (options = {}) => {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000 } = options;

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitStore.has(identifier)) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    const record = rateLimitStore.get(identifier);

    if (now > record.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    record.count++;
    return next();
  };
};

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);

module.exports = rateLimiter;
