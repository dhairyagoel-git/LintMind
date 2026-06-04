const rateLimit = require("express-rate-limit");

const guestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Guest limit reached. Please login to continue.",
  },
});

module.exports = { guestLimiter };