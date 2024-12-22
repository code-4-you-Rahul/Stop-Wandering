const list = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReview = async(req,res,next)=>{
    let {id} = req.params;
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    await newreview.save();
    let individuallisting = await list.findById(id);
    individuallisting.reviews.push(newreview);
    await individuallisting.save();
    req.flash("success","new Review created");
    res.redirect(`/listings/show/${id}`);
};

module.exports.deleteReview = async(req,res,next)=>{
    let {id,reviewid} = req.params;
    await list.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted");
    res.redirect(`/listings/show/${id}`)
    };