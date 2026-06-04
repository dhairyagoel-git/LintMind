const express = require('express')
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const optionalAuthMiddleware = require('../middlewares/optionalAuth.middleware');
const guestRateLimit = require('../middlewares/guestRateLimiter');

router.post('/get-review', optionalAuthMiddleware,guestRateLimit,aiController.getReview  );
module.exports = router;   