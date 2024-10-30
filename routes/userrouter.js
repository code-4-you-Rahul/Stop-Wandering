const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
res.render("users/signup.ejs");
});

router.post("/signup",WrapAsync(async(req,res)=>{
 try{
    let newuser = new user({
        email:req.body.user.email,
        username:req.body.user.username
    });
        await user.register(newuser,req.body.user.password);
        req.flash("success","Welcome to Stop Wandering");
        res.redirect("/listings");
 }
 catch(error){
    req.flash("error",error.message);
    res.redirect("/signup");
 }
    }));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),WrapAsync(async(req,res)=>{
req.flash("success","welcome back to stop wandering");
res.redirect("/listings");
}));

router.get("/logout",(req,res,next)=>{
    req.logout((error)=>{
        if(error){
            return next(error);
        }
        req.flash("success","you logged out successfully");
        res.redirect("/listings");
    });
});
module.exports = router;