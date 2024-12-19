const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const engiene = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

//router section
const lrouter = require("./routes/listingrouter.js");
const rrouter = require("./routes/reviewrouter.js");
const urouter = require("./routes/userrouter.js");
 
//login//signup section 
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");

app.set("view engiene","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine("ejs",engiene);

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride("_method"));


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main()
.then((result)=>{
    console.log("connected");
})
.catch((error)=>{
    console.log(error);
});
//cookie session and flash
const sessionoption ={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires :Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

//root route
app.get("/",(req,res)=>{
    res.send("hi i'm root");
});

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

    //router middlewares
app.use("/listings",lrouter);
app.use("/listings/:id/reviews",rrouter);
app.use("/",urouter);

//page not found middleware
app.all("*",(req,res,next)=>{
throw new ExpressError(404,"page not found");
});

//error handling middleware
app.use((err,req,res,next)=>{
let {status = 500,message = "something went wrong"} = err;
res.status(status).render("listings/error.ejs",{message});
});
//port listen route
app.listen(port,(req,res)=>{
    console.log("listening");
});