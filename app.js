const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const list = require("./models/listing.js");
const methodoverride = require("method-override");
const engiene = require("ejs-mate");
const wrapasync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingschema = require("./schema.js");
const reviewschema = require("./schema.js");
const review = require("./models/review.js");

app.set("view engiene","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine("ejs",engiene);

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride("_method"));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}

main()
.then((result)=>{
    console.log("connected");
})
.catch((error)=>{
    console.log(error);
});
app.get("/",(req,res)=>{
    res.send("hi i'm root");
});
//listing validate function
const listingvalidateschema = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
        }
        else{
            next();
        }
};
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
//index Route
app.get("/listings",wrapasync(async (req,res)=>{
    const lists = await list.find();
    res.render("listings/index.ejs",{lists});
}));
//show route
app.get("/listings/show/:id",wrapasync(async(req,res)=>{
    let {id} = req.params;
    const value = await list.findById(id).populate("reviews");
    res.render("listings/show.ejs",{value});
}));
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});
//post or save route
app.post("/listings",listingvalidateschema,wrapasync(async(req,res,next)=>{
     let newlist = new list(req.body.listing);
  await newlist.save();
  res.redirect("/listings");
}));
//edit route
app.get("/listings/edit/:id",wrapasync(async (req,res)=>{
let {id} = req.params;
const value = await list.findById(id);
res.render("listings/edit.ejs",{value});
}));
//edited value
app.patch("/listings/:id",listingvalidateschema,wrapasync(async (req,res)=>{
    
    let{id} = req.params;
    await list.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true},{new:true});
    res.redirect(`/listings/show/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapasync(async (req,res)=>{
let {id} = req.params;
await list.findByIdAndDelete(id);
res.redirect("/listings");
}));
//review route
//post route
app.post("/listings/:id/reviews",reviewvalidateschema,wrapasync(async(req,res,next)=>{
    let {id} = req.params;
    let newreview = new review(req.body.review);
    await newreview.save();
    let individuallisting = await list.findById(id);
    individuallisting.reviews.push(newreview);
    await individuallisting.save();
    res.redirect(`/listings/show/${id}`);
}));

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