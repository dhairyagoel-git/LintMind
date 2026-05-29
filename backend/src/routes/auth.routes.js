const express = require('express');
const router = express.Router(); //  Correct
const authController = require('../controllers/auth.controller');

router.post("/login",authController.login);
router.post("/signup",authController.signup);
router.post("/logout",authController.logout);
router.get("/getme", authController.getMe );
router.post("/google",authController.google);
router.post("/github",authController.github);

module.exports = router;