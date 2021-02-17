const Order = require('../db-models/order');
const axiosRequests = require('./axios-requests');

setInterval(async () => {

    // Fetching orders that are unfinished from database
    try {
        unfinishedOrders = await Order.find({ State: 'Unfinished', Errors: [] })
    } catch (err) { console.log(err) }

    for (const order of unfinishedOrders) {
        // Asking OPT for order state
        axiosRequests.getState(order);
    }

    // Fetching orders that are unpatched from database
    try {
        unpatchedOrders = await Order.find({ State: 'Finished', Errors: [], Patched: false });
    } catch (err) { console.log(err) }

    for (const order of unpatchedOrders) {
        // Patching order to partner
        axiosRequests.patchState(order);       
    }

}, 60000);