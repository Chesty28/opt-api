const { validationResult } = require('express-validator');
const countryApi = require('iso-3166-1-alpha-2');

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
      OrderID: partnerData.id,
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

    const savedOrder = await mongooseModel.saveOrder(refactoredData, errors ? invalidData : null);

    res.sendStatus(200);
};

exports.getOrder = getOrder;