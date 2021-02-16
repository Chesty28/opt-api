const axios = require('axios');
const Order = require('../db-models/order');
const auth = require('../utils/auth');

setInterval(async () => {
    try {
        // Fetching orders that are unfinished from database
        orders = await Order.find({ State: 'Unfinished', Errors: [] })

        for (const order of orders) {

            // Asking OPT for order state
            console.log(`Asking for order ${order.OrderID} state...`);
            axios.get(`https://us-central1-node-task-assignment.cloudfunctions.net/oapi/api/orders/${order.OrderID}/state`, auth.optAuth())
            .then(async (res) => {
                if (res.data.State === 'Finished') {
                    // Patching to Partner if order is finished
                    axios.patch(`https://us-central1-node-task-assignment.cloudfunctions.net/papi/api/orders/${order.OrderID}`, { state: "Finished" }, auth.partnerAuth())
                    .then(res => {
                        console.log(`Order ${order.OrderID} was finished and partner was informed`);
                    }).catch (err => {
                        let errorMessage = err;
                        if (err.response.status === 400) {
                            errorMessage = `Order ${order.OrderID} was not patched - invalid state value`;
                        } else if (err.response.status === 404) {
                            errorMessage = `Order ${order.OrderID} was not patched - invalid order ID`;
                        }
                        console.log(errorMessage);
                    });

                    // Telling database that order is finished
                    order.State = 'Finished';
                    try {
                        await order.save();
                    } catch (err) { console.log (err) }
                }
            })
            .catch(err => console.log(err));
        }
    } catch (err) {
        console.log(err);
    }
}, 60000);