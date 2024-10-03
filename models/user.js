const mongoose = require("mongoose");
const passportmongoose = require("passport-local-mongoose");
const userschema = new mongoose.Schema({
        email:{
            type:String,
            required:true
        }
});
userschema.plugin(passportmongoose);
module.exports = mongoose.model("User",userschema);