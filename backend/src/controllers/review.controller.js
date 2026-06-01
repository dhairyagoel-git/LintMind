const Review = require("../models/Review");

module.exports.saveReview = async (req, res) => {
  try {
    const { title, language, code, review } = req.body;

    if (!title?.trim() || !language?.trim() || !code?.trim() )
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    let saved;
    if(review?.trim()) {
        saved = await Review.create({
            user: req.user._id,
            title,
            language,
            code, 
            review,
        });
    } else {
        saved  = await Review.create({
            user : req.user._id,
            title,
            language,
            code
        });
    }
        

    res.status(201).json({
      success: true,
      review: saved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getAllReview = async (req,res) =>{
    try {
        const reviews = await Review.find({user : req.user._id});
        // console.log(reviews)
        if(!reviews) return res.status(404).json({success : false , message : "coundn't get reviews!"});
        return res.status(200).json({success : true , reviews});

    } catch (error) {
        return res.status(500).json({success : false, message : error.message});
    }

}
    module.exports.getReviewById = async(req,res)=>{
        try {
            const review = await Review.findById(req.params.id);
            if(!review) { 
                return res.status(404).json({success : false , message : "Review not found"});
            }
            if(review.user.toString() === req.user._id.toString()){
                return res.status(200).json({success : true , review});
            } else {
                return res.status(403).json({success : false , message : "User not matched"});
            }
        } catch (error) {
            return res.status(500).json({success : false , message : error.message})
        }
    }
    module.exports.DeleteReview  = async (req,res)=>{
        try {
            const review = await Review.findById(req.params.id);
            if(!review){
                return res.status(404).json({success : false , message : "Review not found"});
            }
            if(review.user.toString() === req.user._id.toString()){
                const deletedReview = await Review.findByIdAndDelete(review._id);
                return res.status(200).json({success : true , deletedReview});
            } else {
                return res.status(403).json({success : false , message : "User not matched"});
            }

        } catch (error) {
            return res.status(500).json({success : false , message : error.message})
        }
    }