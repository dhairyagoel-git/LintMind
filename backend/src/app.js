const express = require("express");
const rateLimit = require("express-rate-limit");
const aiRoutes = require("./routes/ai.routes");
const authRoutes = require("./routes/auth.routes");
const reviewRoutes = require("./routes/review.routes");
const runRoutes = require("./routes/run.routes")
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const { runAllChains } = require("express-validator/lib/utils");
// const passport = require("./config/passport");
app.use(cors());

app.use(express.json());
// app.use(passport.initialize());
connectDB();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 200, // limit each IP to 20 requests per window

  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("working");
});
app.use("/ai", aiRoutes);
app.use("/auth", authRoutes);
app.use("/review", reviewRoutes);
app.use("/run",runRoutes);
module.exports = app;
