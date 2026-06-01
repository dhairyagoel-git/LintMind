const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true, 
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    code: {
      type: String,
      required: [true, "Code is required"],
    },

    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
    },

    review: {
      type: String,
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);