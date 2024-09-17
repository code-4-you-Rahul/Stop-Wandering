const mongoose = require("mongoose");

const listingschema = new mongoose.Schema(
    {
        title:{
            type:String,
            required : true
        },
        description : {
            type:String
        },
        image:{
            type:String,
            default:"https://www.bing.com/images/search?view=detailV2&ccid=yFaLr3I9&id=D385F44A78C83A1A6DD3D460B73D7BCBDBFA4ED7&thid=OIP.yFaLr3I9M01f46ZRmROplgHaE8&mediaurl=https%3a%2f%2fget.pxhere.com%2fphoto%2fbeach-sea-coast-tree-sand-ocean-sky-sunshine-boat-sunlight-shore-summer-vacation-lagoon-bay-island-body-of-water-blue-sky-caribbean-palm-trees-tropics-arecales-palm-family-918375.jpg&exph=3744&expw=5616&q=copyright+free+beach+images&simid=608023114920906260&FORM=IRPRST&ck=D21C1A5D37CF6DC679BFDCF03A8FC060&selectedIndex=0&itb=0&idpp=overlayview&ajaxhist=0&ajaxserp=0",
            set:(v)=>v===" "?"https://www.bing.com/images/search?view=detailV2&ccid=yFaLr3I9&id=D385F44A78C83A1A6DD3D460B73D7BCBDBFA4ED7&thid=OIP.yFaLr3I9M01f46ZRmROplgHaE8&mediaurl=https%3a%2f%2fget.pxhere.com%2fphoto%2fbeach-sea-coast-tree-sand-ocean-sky-sunshine-boat-sunlight-shore-summer-vacation-lagoon-bay-island-body-of-water-blue-sky-caribbean-palm-trees-tropics-arecales-palm-family-918375.jpg&exph=3744&expw=5616&q=copyright+free+beach+images&simid=608023114920906260&FORM=IRPRST&ck=D21C1A5D37CF6DC679BFDCF03A8FC060&selectedIndex=0&itb=0&idpp=overlayview&ajaxhist=0&ajaxserp=0":v
        },
        price:{
            type : Number
        },
        location:{
            type : String,
            required:true
        },
        country:{
            type:String
        },
        reviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        }]
    }
);

const list = mongoose.model("list",listingschema);

module.exports = list;