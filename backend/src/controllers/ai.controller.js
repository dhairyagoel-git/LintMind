const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  const code = req.body.code;
  const language = req.body.language;
  if (!code) {
    return res.status(404).send("Prompt is required");
  }
//   console.log(code);
  const numberedCode = code
    .split("\n")
    .map((line, index) => `${index + 1}: ${line}`)
    .join("\n");
    console.log(numberedCode)
  const response = await aiService(numberedCode, language);

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const review = JSON.parse(cleaned);
  console.log(review)
  res.json(review);
};
