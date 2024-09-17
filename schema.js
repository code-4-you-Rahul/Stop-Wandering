const Joi = require("joi");
const listingschema = Joi.object({
    listing:Joi.object({
        title :Joi.string().required(),
        description : Joi.string().required(),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        price:Joi.number().required().min(1),
        country:Joi.string().required()
    }).required()
});
module.exports = listingschema;
const reviewschema = Joi.object({
review:Joi.object({
    rating:Joi.number().required().min(1),
    comment:Joi.string().required()
}).required()
});
module.exports = reviewschema;