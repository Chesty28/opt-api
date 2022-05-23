const { Router } = require('express');

const mongooseModel = require('../database/mongoose');
const optApi = require('../api/opt-api');
const dataRefactor = require('../services/data-refactor');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth.checkPartnerAuth);

router.post('/', async (req, res) => {
	// Refactoring data
	const data = await dataRefactor(req.body);

	// If errors => save to database without post to OPT
	if (data.validationResult.error) {
		await mongooseModel.newOrder(
			data.refactoredData,
			data.validationResult.error.details
		);
		console.log('Invalid order received - ' + data.refactoredData.OrderID);
	} else {
		optApi.postOrder(data.refactoredData);
		await mongooseModel.newOrder(data.refactoredData);
	}
	res.sendStatus(200);
});

module.exports = router;
