const { validationResult } = require('express-validator');
const countryApi = require('iso-3166-1-alpha-2');
const axios = require('axios');

const mongooseModel = require('../mongoose');

const getOrder = async (req, res) => {
    const errors = validationResult(req);
    const invalidData = [];
    if (!errors.isEmpty()) {
        for (const error of errors.errors) {
            invalidData.push(error.param);
        }
    }

    const partnerData = req.body

    let carrierId = null;
    switch (partnerData.carrierKey) {
      case 'DPD': carrierId = 1001; break;
      case 'DHL': carrierId = 1002; break;
      case 'DHL Express': carrierId = 1003; break;
      case 'UPS': carrierId = 1004; break;
      case 'GLS': carrierId = 1005; break;
    }

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
    }

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

    await mongooseModel.saveOrder(refactoredData, invalidData);

    const config = { headers: { Authorization: 'Basic VGVzdFVzZXI6MkFzZjI3ZERWY3ZkOHNkMWRmU2Zk'} } //replace for base64 encryption
    axios.post('https://us-central1-node-task-assignment.cloudfunctions.net/oapi/api/orders', refactoredData, config)
    .then(optRes => res.sendStatus(optRes.status))
    .catch(err => res.status(err.response.status).send(err.response.data));
};

exports.getOrder = getOrder;