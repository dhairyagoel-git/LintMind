const express = require('express');
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protect } = require('../middlewares/auth.middleware');


router.post("/save-review", protect,reviewController.saveReview);
router.get("/get-all-reviews",protect,reviewController.getAllReview);
router.get("/get-review-by-id/:id",protect,reviewController.getReviewById);
router.delete("/delete-review-by-id/:id",protect,reviewController.DeleteReview  );


module.exports = router;