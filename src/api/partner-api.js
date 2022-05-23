const axios = require('axios');
const auth = require('../middlewares/auth');

const patchState = async (order) => {
	try {
		await axios.patch(
			`${process.env.PARTNER_URL}/${order.OrderID}`,
			{ state: 'Finished' },
			auth.partnerAuth()
		);
		console.log(`Order ${order.OrderID} was patched to partner`);
		return true;
	} catch (err) {
		let errorMessage = err.response.status;
		if (err.response.status === 400) {
			errorMessage = `Order ${order.OrderID} was not patched - invalid state value`;
		} else if (err.response.status === 404) {
			errorMessage = `Order ${order.OrderID} was not patched - invalid order ID`;
		}
		console.log(errorMessage);
		return false;
	}
};

exports.patchState = patchState;
