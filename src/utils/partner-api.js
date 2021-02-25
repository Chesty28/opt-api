const axios = require('axios');
const auth = require('./auth');

const mongooseModel = require('../mongoose');


const patchState = order => {
    axios.patch(`${process.env.PARTNER_URL}/${order.OrderID}`, { state: "Finished" }, auth.partnerAuth())
    .then(async () => {
        console.log(`Order ${order.OrderID} was patched to partner`);

        // Telling database that order is patched to partner 
        order.Patched = true;
        await mongooseModel.saveOrder(order);
    })
    .catch (err => {
        let errorMessage = err;
        if (err.response.status === 400) {
            errorMessage = `Order ${order.OrderID} was not patched - invalid state value`;
        } else if (err.response.status === 404) {
            errorMessage = `Order ${order.OrderID} was not patched - invalid order ID`;
        }
            console.log(errorMessage);
    });
}

exports.patchState = patchState;