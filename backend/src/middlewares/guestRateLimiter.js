const { guestLimiter } = require("./rateLimiter");

const guestRateLimit = (req, res, next) => {
  // Logged in user
  if (req.user) {
    return next();
  }

  // Guest user
  return guestLimiter(req, res, next);
};

module.exports = guestRateLimit;