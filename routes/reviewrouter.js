const express = require("express");
const rrouter = express.Router({mergeParams:true});
const {reviewschema} = require("../schema.js");
const review = require("../models/review.js");
const wrapasync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const list = require("../models/listing.js");
const { isLoggedIn,isAuthor } = require("../middleware.js");

//review validate schema using joi
const reviewvalidateschema = (req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
        }
        else{
            next();
        }
};


//review route
//post route
rrouter.post("/",
    isLoggedIn,
    reviewvalidateschema,
    wrapasync(async(req,res,next)=>{
    let {id} = req.params;
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    await newreview.save();
    let individuallisting = await list.findById(id);
    individuallisting.reviews.push(newreview);
    await individuallisting.save();
    req.flash("success","new Review created");
    res.redirect(`/listings/show/${id}`);
}));
//review delete review route
rrouter.delete("/:reviewid",
    isLoggedIn,
    isAuthor,
    wrapasync(async(req,res,next)=>{
let {id,reviewid} = req.params;
await list.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
await review.findByIdAndDelete(reviewid);
req.flash("success","Review deleted");
res.redirect(`/listings/show/${id}`)
}));
module.exports = rrouter;