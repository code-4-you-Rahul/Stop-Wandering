const list = require("../models/listing.js");
module.exports.index = async (req,res)=>{
    const lists = await list.find();
    res.render("listings/index.ejs",{lists});
};
module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const value = await list.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    if(!value){
       req.flash("error","listing you requrested does not exist");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{value});
};
module.exports.new = (req,res)=>{
    res.render("listings/new.ejs")
};
module.exports.save = async(req,res,next)=>{
     let newlist = new list(req.body.listing);
     newlist.owner = req.user._id;
  await newlist.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
};
module.exports.edit = async(req,res)=>{
let {id} = req.params;
const value = await list.findById(id);
if(!value){
    req.flash("error","listing not exist");
    res.redirect("/listings");
}
res.render("listings/edit.ejs",{value});
};
module.exports.editedValue = async (req,res)=>{
    let{id} = req.params;
    await list.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true},{new:true});
    req.flash("success","listing updated");
    res.redirect(`/listings/show/${id}`);
};
module.exports.destroy = async (req,res)=>{
    let {id} = req.params;
    await list.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
    };