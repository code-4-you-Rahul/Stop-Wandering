const list = require("./models/listing.js");
const review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
        next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await list.findById(id);
if(!listing.owner._id.equals(res.locals.currentUser._id)){
req.flash("error","You have no Permission to Access it");
return res.redirect(`/listings/show/${id}`);
}
next();
};

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewid} = req.params;
    const reviews = await review.findById(reviewid);
if(!reviews.author._id.equals(res.locals.currentUser._id)){
req.flash("error","You have no Permission to Access it");
return res.redirect(`/listings/show/${id}`);
}
next();
};

