const { Router } = require('express');
const { check } = require('express-validator');

const ordersController = require('../controllers/orders-controller');

const router = Router();

router.post('/', [
    check('id').not().isEmpty(),
    check('fullName').not().isEmpty(),
    check('email').not().isEmpty(),
    check('phone').not().isEmpty(),
    check('addressLine1').not().isEmpty(),
    check('zipCode').not().isEmpty(),
    check('city').not().isEmpty(),
    check('country').not().isEmpty(),
    check('carrierKey').not().isEmpty(),
    check('status').not().isEmpty()
], ordersController.getOrder);

module.exports = router;