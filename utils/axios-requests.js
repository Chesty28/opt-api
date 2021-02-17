const axios = require('axios');
const auth = require('./auth');

const mongooseAccess = require('../mongoose');

const getState = order => {
    console.log(`Asking for order ${order.OrderID} state...`);
    axios.get(`https://us-central1-node-task-assignment.cloudfunctions.net/oapi/api/orders/${order.OrderID}/state`, auth.optAuth())
    .then(async (res) => {
        if (res.data.State === 'Finished') {
            console.log(`Order ${order.OrderID} was finished`);
            // Telling database that order is finished
            order.State = 'Finished';
            try {
                await order.save();
            } catch (err) { console.log (err) }

            // Patching finished order to partner
            patchState(order);
        }
    })
    .catch(err => console.log(err));
};

const patchState = order => {
    axios.patch(`https://us-central1-node-task-assignment.cloudfunctions.net/papi/api/orders/${order.OrderID}`, { state: "Finished" }, auth.partnerAuth())
    .then(async res => {
        console.log(`Order ${order.OrderID} was patched to partner`);

        // Telling database that order is patched to partner 
        order.Patched = true;
        try {
            await order.save();
        } catch (err) { console.log (err) }     
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

const postOrder = data => {
    axios.post('https://us-central1-node-task-assignment.cloudfunctions.net/oapi/api/orders', data, auth.optAuth())
    .then(async () => {
        console.log(`Order ${data.OrderID} was accepted by OPT`);
  
        // Saving order to database
        await mongooseAccess.saveOrder(data);
    })
    .catch(async err => {
        console.log(err);
    });
}

exports.getState = getState;
exports.patchState = patchState;
exports.postOrder = postOrder;