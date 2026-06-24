const axios = require("axios");

module.exports.runCode = async (req, res) => {
  try {
    const languageMap = {
      cpp: 54,
      java: 62,
      python: 71,
      javascript: 63,
      c: 50,
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
    
    const encodedCode = Buffer.from(code).toString("base64");

    const submission = await axios.post(
      `${process.env.JUDGE_URL}/submissions?base64_encoded=true&wait=true`, 
      {
        source_code: encodedCode, 
        language_id: languageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const result = submission.data;
    // console.log(result);

    
    const decode = (str) =>
      str ? Buffer.from(str, "base64").toString("utf-8") : null;

    res.status(200).json({
      success: true,
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),              
      compile_output: decode(result.compile_output), 
      time: result.time,
      memory: result.memory,
      description : result.status.description
    });
    
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};