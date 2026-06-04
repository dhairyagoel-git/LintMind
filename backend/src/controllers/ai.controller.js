const aiService = require('../services/ai.service')

module.exports.getReview = async (req,res)=>{
    const code = req.body.code
    const language = req.body.language
    if(!code) {
        return res.status(404).send("Prompt is required");
    }

    const response = await aiService(code,language);
    res.send(response);
    
}