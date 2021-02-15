const { Router } = require('express');
const { check } = require('express-validator');

const ordersController = require('../controllers/orders-controller');

const router = Router();

router.post('/', [
    check('id').trim().isInt().not().isEmpty(),
    check('fullName').trim().isAlpha().not().isEmpty(),
    check('email').trim().normalizeEmail().isEmail().not().isEmpty(),
    check('phone').trim().isAlpha().not().isEmpty(),
    check('addressLine1').trim().isAlpha().not().isEmpty(),
    check('zipCode').trim().isAlpha().not().isEmpty(),
    check('city').trim().isAlpha().not().isEmpty(),
    check('country').trim().isAlpha().not().isEmpty(),
    check('carrierKey').trim().isAlphanumeric(),
    check('status').trim().isAlpha().not().isEmpty()
], ordersController.getOrder);

module.exports = router;