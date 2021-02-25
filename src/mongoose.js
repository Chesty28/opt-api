const Order = require('./db-models/order');

const newOrder = async (orderData, invalidData) => {
    let data = orderData;
    data = { ...orderData, Errors: invalidData, State: 'Unfinished', Patched: false };
    const order = new Order(data);

    let result;
    try {
      result = await order.save();
    } catch (err) {
      console.log(err);
    }
    return result;
}

const fetchUnfinished = async () => {
  let unfinishedOrders = [];
  try {
    unfinishedOrders = await Order.find({ State: 'Unfinished', Errors: [] });
  } catch (err) { console.log(err); }
  return unfinishedOrders;
};

const fetchUnpatched = async () => {
  let unpatchedOrders = [];
  try {
    unpatchedOrders = await Order.find({ State: 'Finished', Errors: [], Patched: false });
  } catch (err) { console.log(err) }
  return unpatchedOrders;
}

const saveOrder = async order => {
  try {
    await order.save();
  } catch (err) { console.log (err) }
}

exports.newOrder = newOrder;
exports.fetchUnfinished = fetchUnfinished;
exports.fetchUnpatched = fetchUnpatched;
exports.saveOrder = saveOrder;