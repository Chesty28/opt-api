const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = mongoose.Schema({
    OrderID: { type: String, unique: true },
    InvoiceSendLater: Boolean,
    Issued: String,
    OrderType: String,
    Shipping: { 
        CarrierID: Number,
        DeliveryAddress: { 
            AddressLine1: String,
            AddressLine2: String,
            City: String,
            Company: String,
            CountryCode: String,
            Email: String,
            PersonName: String,
            Phone: String,
            State: String,
            Zip: String,
        },
    },
    Products: Array,
    Errors: Array,
    State: String
});

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);