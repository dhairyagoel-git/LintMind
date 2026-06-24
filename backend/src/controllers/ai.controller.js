const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const { code, language, problemDescription } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Code is required",
      });
    }

    const numberedCode = code
      .split("\n")
      .map((line, index) => `${index + 1}: ${line}`)
      .join("\n");

    const response = await aiService(
      numberedCode,
      language,
      problemDescription,
    );

    // const cleaned = response
    //   .replace(/```json/g, "")
    //   .replace(/```/g, "")
    //   .trim();

    const review = JSON.parse(response);

    res.json(review);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate review",
    });
  }
};
