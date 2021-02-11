const mongoose = require('mongoose');

const Order = require('./models/order');

const saveOrder = async (orderData, invalidData) => {
    let data = orderData;
    if (invalidData.length !== 0) {
      data = { ...orderData, Errors: invalidData }
    }

    const order = new Order(data);

    mongoose.connect('mongodb+srv://admin:KWOBsuq9gTQbR0dj@cluster0.vpfqb.mongodb.net/opt-api?retryWrites=true&w=majority')
    .catch (() => {
      console.log('Connection to MongoDB failed!');
    });

    const result = await order.save();
    return result;
}

exports.saveOrder = saveOrder;