const countryApi = require('iso-3166-1-alpha-2');

const orderSchema = require('./validation-schema');

module.exports = async partnerData => {

    const validationResult = orderSchema.validate(partnerData, { abortEarly: false });

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
    const products = partnerData.details.map(product => {
      return {
        Barcode: product.eanCode,
        OPTProductID: product.eanCode,
        Qty: product.quantity
      }
    });
    
    refactoredData = {
      ...refactoredData,
      Products: products
    };
    
    return { refactoredData, validationResult };
};