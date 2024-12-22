const express = require("express");
const rrouter = express.Router({mergeParams:true});
const {reviewschema} = require("../schema.js");
const review = require("../models/review.js");
const wrapasync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const list = require("../models/listing.js");
const { isLoggedIn,isAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");

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
    wrapasync(reviewControllers.createReview));
//review delete review route
rrouter.delete("/:reviewid",
    isLoggedIn,
    isAuthor,
    wrapasync(reviewControllers.deleteReview));
module.exports = rrouter;