const express = require("express");
const lrouter = express.Router();
const list = require("../models/listing.js");
const wrapasync = require("../utils/WrapAsync.js");
const {listingschema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");

//listing validate function
const listingvalidateschema = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400,error);
        }
        else{
            next();
        }
};
//index route
lrouter.get("/",wrapasync(async (req,res)=>{
    const lists = await list.find();
    res.render("listings/index.ejs",{lists});
}));
//show route
lrouter.get("/show/:id",wrapasync(async(req,res)=>{
    let {id} = req.params;
    const value = await list.findById(id).populate("reviews");
    if(!value){
       req.flash("error","listing you requrested does not exist");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{value});
}));
//new route
lrouter.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
});
//post or save route
lrouter.post("/",isLoggedIn,listingvalidateschema,wrapasync(async(req,res,next)=>{
     let newlist = new list(req.body.listing);
  await newlist.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
}));
//edit route
lrouter.get("/edit/:id",isLoggedIn,wrapasync(async (req,res)=>{
let {id} = req.params;
const value = await list.findById(id);
if(!value){
    req.flash("error","listing not exist");
    res.redirect("/listings");
}
res.render("listings/edit.ejs",{value});
}));
//edited value
lrouter.patch("/:id",isLoggedIn,listingvalidateschema,wrapasync(async (req,res)=>{
    let{id} = req.params;
    await list.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true},{new:true});
    req.flash("success","listing updated");
    res.redirect(`/listings/show/${id}`);
}));
//delete route
lrouter.delete("/:id",isLoggedIn,wrapasync(async (req,res)=>{
let {id} = req.params;
await list.findByIdAndDelete(id);
req.flash("success","listing deleted");
res.redirect("/listings");
}));

module.exports = lrouter;