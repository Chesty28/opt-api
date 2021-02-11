const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    OrderID: { type: String },
    InvoiceSendLater: { type: Boolean, default: false },
    Issued: { type: Date },
    OrderType: { type: String, default: 'standard' },
    Shipping: { 
        CarrierID: { type: Number },
        DeliveryAddress: { 
            AddressLine1: { type: String },
            AddressLine2: { type: String },
            City: { type: String },
            Company: { type: String },
            CountryCode: { type: String },
            Email: { type: String },
            PersonName: { type: String },
            Phone: { type: String },
            State: { type: String },
            Zip: { type: String },
        },
    },
    Products: { type: Array },
    Errors: { type: Array }
});

module.exports = mongoose.model('Order', orderSchema);