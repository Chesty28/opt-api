const partnerApi = require('../api/partner-api');
const optApi = require('../api/opt-api');
const mongooseModel = require('../database/mongoose');

setInterval(async () => {
	const unfinishedOrders = await mongooseModel.fetchUnfinished();
	for (let order of unfinishedOrders) {
		const isFinished = await optApi.getState(order);

		if (isFinished) {
			order.State = 'Finished';
			await mongooseModel.saveOrder(order);
		}
	}

	const unpatchedOrders = await mongooseModel.fetchUnpatched();
	for (let order of unpatchedOrders) {
		const isPatched = await partnerApi.patchState(order);

		if (isPatched) {
			order.Patched = true;
			await mongooseModel.saveOrder(order);
		}
	}
}, 60000);
