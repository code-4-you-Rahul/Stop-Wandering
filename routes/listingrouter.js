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
lrouter.route("/")
.get(wrapasync(listingControllers.index))
.post(isLoggedIn,listingvalidateschema,wrapasync(listingControllers.save));

//show route
lrouter.get("/show/:id",wrapasync(listingControllers.show));
//new route
lrouter.get("/new",isLoggedIn,listingControllers.new);

//edit route
lrouter.get("/edit/:id",
    isLoggedIn,
    isOwner,
    wrapasync(listingControllers.edit));
//edited value
lrouter.route("/:id")
.patch(
    isLoggedIn,
    isOwner,
    listingvalidateschema,
    wrapasync(listingControllers.editedValue))
.delete(
        isLoggedIn,
        isOwner,
        wrapasync(listingControllers.destroy));

module.exports = lrouter;