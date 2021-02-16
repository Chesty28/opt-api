const { Router } = require('express');
const countryApi = require('iso-3166-1-alpha-2');
const axios = require('axios');

const mongooseModel = require('../mongoose');
const auth = require('../utils/auth');
const validateData = require('../utils/validate-data');

const router = Router();

router.post('/', async (req, res) => {
    if (req.headers['x-api-key'] !== auth.key2) {
        res.sendStatus(401);
    }

    const partnerData = req.body

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

    if (errors.length !== 0) {
      await mongooseModel.saveOrder(refactoredData, errors);
      return res.sendStatus(200);
    }

    // Sending order to OPT
    axios.post('https://us-central1-node-task-assignment.cloudfunctions.net/oapi/api/orders', refactoredData, auth.optAuth())
    .then(async optRes => {
      res.sendStatus(optRes.status);
      console.log(`Order ${refactoredData.OrderID} was accepted by OPT`);

      // Saving order to database
      await mongooseModel.saveOrder(refactoredData);
    })
    .catch(async err => {
      console.log(err);
      res.sendStatus(200);
    });
});

module.exports = router;