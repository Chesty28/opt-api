const axios = require('axios');
const auth = require('./auth');

const partnerApi = require('./partner-api');
const mongoose = require('../mongoose');

const getState = order => {
    console.log(`Asking for order ${order.OrderID} state...`);
    axios.get(`${process.env.OPT_URL}/${order.OrderID}/state`, auth.optAuth())
    .then(async (res) => {
        if (res.data.State === 'Finished') {
            console.log(`Order ${order.OrderID} was finished`);
            // Telling database that order is finished
            order.State = 'Finished';
            mongoose.saveOrder(order);

            // Patching finished order to partner
            partnerApi.patchState(order);
        }
    })
    .catch(err => console.log(err));
};

const postOrder = data => {
    axios.post(process.env.OPT_URL, data, auth.optAuth())
    .then(async () => {
        console.log(`Order ${data.OrderID} was accepted by OPT`);
    })
    .catch(async err => {
        console.log(err);
    });
}

exports.postOrder = postOrder;
exports.getState = getState;