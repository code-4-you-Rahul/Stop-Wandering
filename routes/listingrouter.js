const express = require("express");
const lrouter = express.Router();
const list = require("../models/listing.js");
const wrapasync = require("../utils/WrapAsync.js");
const {listingschema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");

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
lrouter.get("/",wrapasync(listingControllers.index));
//show route
lrouter.get("/show/:id",wrapasync(listingControllers.show));
//new route
lrouter.get("/new",isLoggedIn,listingControllers.new);
//post or save route
lrouter.post("/",isLoggedIn,listingvalidateschema,wrapasync(listingControllers.save));
//edit route
lrouter.get("/edit/:id",
    isLoggedIn,
    isOwner,
    wrapasync(listingControllers.edit));
//edited value
lrouter.patch("/:id",
    isLoggedIn,
    isOwner,
    listingvalidateschema,
    wrapasync(listingControllers.editedValue));
//delete route
lrouter.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapasync(listingControllers.destroy));

module.exports = lrouter;