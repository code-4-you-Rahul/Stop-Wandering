//listing schema
const Joi = require("joi");
module.exports.listingschema = Joi.object({
    listing:Joi.object({
        title :Joi.string().required(),
        description : Joi.string().required(),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        price:Joi.number().required().min(1),
        country:Joi.string().required()
    }).required(),
});

//review schema::

module.exports.reviewschema = Joi.object({
review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
}).required(),
});
