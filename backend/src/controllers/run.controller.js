const axios = require("axios");

module.exports.runCode = async (req, res) => {
  try {
    const languageMap = {
      cpp: 54,
      java: 62,
      python: 71,
      javascript: 63,
    };

    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required",
      });
    }

    const languageId = languageMap[language];

    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }

    const submission = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = submission.data;

    console.log(result);

    res.status(200).json({
      success: true,
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status?.description,
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};