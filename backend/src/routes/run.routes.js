const express = require("express");
// const { protect } = require("../middlewares/auth.middleware");
const router = express.Router();
const runController = require("../controllers/run.controller")

router.post("/run-code",runController.runCode)

module.exports = router;