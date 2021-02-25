let errors = [];

const checkValidity = (data, type, param, rules) => {
    if (typeof data !== type && rules.includes('dataType')) {
        errors.push(`${param} is not ${type}`);
    }
    if (data != null && data.length < 1 && rules.includes('notEmpty')) {
        errors.push(`${param} is empty`);
    }
}

const validateData = data => {
    errors = [];
    checkValidity(data.id, 'string', 'Full Name', ['notEmpty']);
    checkValidity(data.fullName, 'string', 'Full Name', ['dataType', 'notEmpty']);
    checkValidity(data.email, 'string', 'Email', ['dataType', 'notEmpty']);
    checkValidity(data.phone, 'string', 'Phone', ['dataType', 'notEmpty']);
    checkValidity(data.addressLine1, 'string', 'Address Line 1', ['dataType', 'notEmpty']);
    checkValidity(data.zipCode, 'string', 'Zip Code', ['dataType', 'notEmpty']);
    checkValidity(data.city, 'string', 'City', ['dataType', 'notEmpty']);
    checkValidity(data.country, 'string', 'County', ['dataType', 'notEmpty']);
    checkValidity(data.carrierKey, 'string', 'Carrier Key', ['dataType', 'notEmpty']);
    checkValidity(data.status, 'string', 'Status', ['dataType', 'notEmpty']);
    for (const product of data.details) {
        checkValidity(product.productId, 'number', 'Product ID', ['dataType', 'notEmpty']);
        checkValidity(product.name, 'string', 'Product Name', ['dataType', 'notEmpty']);
        checkValidity(product.quantity, 'number', 'Quantity', ['dataType', 'notEmpty']);
        checkValidity(product.weight, 'number', 'Weight', ['dataType', 'notEmpty']);
        checkValidity(product.eanCode, 'string', 'EAN Code', ['dataType', 'notEmpty']);
    }

    return errors;
}

module.exports = validateData;