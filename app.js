const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const engiene = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const lrouter = require("./routes/listingrouter.js");
const rrouter = require("./routes/reviewrouter.js");


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

app.use("/listings",lrouter);
app.use("/listings/:id/reviews",rrouter);

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