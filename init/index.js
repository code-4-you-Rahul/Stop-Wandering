const mongoose = require("mongoose");
const list = require("../models/listing.js");
const data = require("./data.js");

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

async function initialize(){
    await list.deleteMany();
    await list.insertMany(data);
}
initialize()
.then((result)=>{
    console.log("data inserted");
})
.catch((error)=>{
    console.log(error);
})
;
