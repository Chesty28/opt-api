const partnerApi = require('./partner-api');
const optApi = require('./opt-api');
const mongooseModel = require('../mongoose');

setInterval(async () => {

    const unfinishedOrders = await mongooseModel.fetchUnfinished();
    for (let order of unfinishedOrders) {
        optApi.getState(order);
    }

    const unpatchedOrders = await mongooseModel.fetchUnpatched();
    for (let order of unpatchedOrders) {
        partnerApi.patchState(order);       
    }

}, 60000);