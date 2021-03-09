const axios = require('axios');
const auth = require('../middlewares/auth');

const getState = async (order) => {
	console.log(`Asking for order ${order.OrderID} state...`);
	try {
		const res = await axios.get(
			`${process.env.OPT_URL}/${order.OrderID}/state`,
			auth.optAuth()
		);
		if (res.config.headers.Authorization !== auth.hash) {
			return res.sendStatus(401);
		}
		if (res.data.State === 'Finished') {
			console.log(`Order ${order.OrderID} was finished`);
			return true;
		}
	} catch (err) {
		console.log(err);
	}
};

const postOrder = async (data) => {
	try {
		await axios.post(process.env.OPT_URL, data, auth.optAuth());

		console.log(`Order ${data.OrderID} was accepted by OPT`);
	} catch (err) {
		console.log(err);
	}
};

exports.postOrder = postOrder;
exports.getState = getState;
