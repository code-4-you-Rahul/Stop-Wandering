const express = require("express");
const lrouter = express.Router();
const list = require("../models/listing.js");
const wrapasync = require("../utils/WrapAsync.js");
const {listingschema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

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
    res.render("listings/show.ejs",{value});
}));
//new route
lrouter.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});
//post or save route
lrouter.post("/",listingvalidateschema,wrapasync(async(req,res,next)=>{
     let newlist = new list(req.body.listing);
  await newlist.save();
  res.redirect("/listings");
}));
//edit route
lrouter.get("/edit/:id",wrapasync(async (req,res)=>{
let {id} = req.params;
const value = await list.findById(id);
res.render("listings/edit.ejs",{value});
}));
//edited value
lrouter.patch("/:id",listingvalidateschema,wrapasync(async (req,res)=>{
    
    let{id} = req.params;
    await list.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true},{new:true});
    res.redirect(`/listings/show/${id}`);
}));
//delete route
lrouter.delete(" /:id",wrapasync(async (req,res)=>{
let {id} = req.params;
await list.findByIdAndDelete(id);
res.redirect("/listings");
}));

module.exports = lrouter;