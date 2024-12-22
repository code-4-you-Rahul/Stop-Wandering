const user = require("../models/user.js");

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
    };

    module.exports.signup = async(req,res)=>{
     try{
        let newuser = new user({
            email:req.body.user.email,
            username:req.body.user.username
        });
           const registeredUser =  await user.register(newuser,req.body.user.password);
           req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Stop Wandering");
            res.redirect("/listings");
           });
     }
     catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
     }
        };
module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to stop wandering");
    (res.locals.redirectUrl === undefined)?res.redirect("/listings"):res.redirect(res.locals.redirectUrl);
    };

    module.exports.logout = (req,res,next)=>{
        req.logout((error)=>{
            if(error){
                return next(error);
            }
            req.flash("success","you logged out successfully");
            res.redirect("/listings");
        });
    };