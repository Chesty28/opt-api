const { Router } = require('express');

const mongooseModel = require('../mongoose');
const optApi = require('../utils/opt-api');
const dataRefactor = require('../utils/data-refactor');

const router = Router();

router.post('/', async (req, res) => {
    // Checking request authentication
    if (req.headers['x-api-key'] !== process.env.KEY2) {
        res.sendStatus(401);
    }

    // Refactoring data
    const data = await dataRefactor(req.body);

    // If errors => save to database without post to OPT
    if (data.validationResult.error) {

      await mongooseModel.newOrder(data.refactoredData, data.validationResult.error.details);
      console.log('Invalid order received - ' + data.refactoredData.OrderID);
      
    } else {

      optApi.postOrder(data.refactoredData);
      await mongooseModel.newOrder(data.refactoredData);
    }
    res.sendStatus(200);
});

module.exports = router;