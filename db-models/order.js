const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    OrderID: String,
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
    Products: { type: Array },
    Errors: { type: Array }
});

module.exports = mongoose.model('Order', orderSchema);