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
   const newArray = data.map((el)=>(
        {
            ...el,
            owner:"6763b7d2cf2bae9d52fcc8e0",
        }

    ));
    await list.insertMany(newArray);
}
initialize()
.then((result)=>{
    console.log("data inserted");
})
.catch((error)=>{
    console.log(error);
})
;
