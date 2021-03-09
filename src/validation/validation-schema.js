const joi = require('joi');

const orderSchema = joi.object().keys({
    id: joi.number().integer().required(),
    fullName: joi.string().required(),
    email: joi.string().email(),
    phone: joi.string().required(),
    addressLine1: joi.string().required(),
    addressLine2: joi.string().allow(null).optional(),
    company: joi.string().allow(null).optional(),
    zipCode: joi.string().required(),
    city: joi.string().required(),
    country: joi.string().required(),
    carrierKey: joi.string().required(),
    status: joi.string().required(),
    details: joi.array().items({
        productId: joi.number().integer().required(),
        name: joi.string().required(),
        quantity: joi.number().integer().required(),
        weight: joi.number().integer().required(),
        eanCode: joi.string().required()
    })
});

module.exports = orderSchema;