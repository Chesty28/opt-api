const Order = require('./db-models/order');

const saveOrder = async (orderData, invalidData) => {
    let data = orderData;
    // Add state of order
    data = { ...orderData, Errors: invalidData }
    const order = new Order(data);

    let result;
    try {
      result = await order.save();
    } catch (err) {
      console.log(err);
    }
    return result;
}

exports.saveOrder = saveOrder;