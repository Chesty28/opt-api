const { Router } = require('express');
const countryApi = require('iso-3166-1-alpha-2');

const mongooseModel = require('../mongoose');
const auth = require('../utils/auth');
const validateData = require('../utils/validate-data');
const axiosRequests = require('../utils/axios-requests');

const router = Router();

router.post('/', async (req, res) => {
    // Checking request authentication
    if (req.headers['x-api-key'] !== auth.key2) {
        res.sendStatus(401);
    }

    const partnerData = req.body

    // Validating order
    const errors = validateData(partnerData);

    // Setting carrier ID
    let carrierId = null;
    switch (partnerData.carrierKey) {
      case 'DPD': carrierId = 1001; break;
      case 'DHL': carrierId = 1002; break;
      case 'DHL Express': carrierId = 1003; break;
      case 'UPS': carrierId = 1004; break;
      case 'GLS': carrierId = 1005; break;
    }

    // Refactoring Partner data to OPT standard
    let refactoredData = {
      OrderID: partnerData.id.toString(),
      InvoiceSendLater: false,
      Issued: new Date().toISOString(),
      OrderType: 'standard',
      Shipping: {
        CarrierID: carrierId,
        DeliveryAddress: {
          AddressLine1: partnerData.addressLine1,
          AddressLine2: partnerData.addressLine2,
          City: partnerData.city,
          Company: partnerData.company,
          CountryCode: countryApi.getCode(partnerData.country) || partnerData.country,
          Email: partnerData.email,
          PersonName: partnerData.fullName,
          Phone: partnerData.phone,
          State: partnerData.country,
          Zip: partnerData.zipCode,
        }
      }
    };

    // Adding Partner products to refactored data
    const products = [];
    for (const product of partnerData.details) {
      let newProduct = { 
        Barcode: product.eanCode,
        OPTProductID: product.eanCode,
        Qty: product.quantity
      };
      products.push(newProduct);
    }

    const newData = {
      ...refactoredData,
      Products: products
    };
    refactoredData = newData;

    // If errors => save to database without post to OPT
    if (errors.length !== 0) {
      await mongooseModel.saveOrder(refactoredData, errors);
      console.log('Invalid order received - ' + refactoredData.OrderID);
    } else {
      // Sending order to OPT
      axiosRequests.postOrder(refactoredData);
    }
    res.sendStatus(200);
});

module.exports = router;