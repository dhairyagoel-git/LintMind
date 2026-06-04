const express = require("express");
const aiRoutes = require("./routes/ai.routes");
const authRoutes = require("./routes/auth.routes");
const reviewRoutes = require("./routes/review.routes");
const runRoutes = require("./routes/run.routes");
const cors = require("cors");
const app = express();
app.set("trust proxy", 1);
const connectDB = require("./config/db");
const { runAllChains } = require("express-validator/lib/utils");
// const passport = require("./config/passport");
app.use(cors());

app.use(express.json());
// app.use(passport.initialize());
connectDB();



app.get("/", (req, res) => {
  res.send("working");
});
app.use("/ai", aiRoutes);
app.use("/auth", authRoutes);
app.use("/review", reviewRoutes);
app.use("/run", runRoutes);
module.exports = app;
