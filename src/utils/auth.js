const key1 = 'KdofdDxc2Asf27dDVcvd8sd1dfSfdv1';
const key2 = 'UJbs62MP41dFgGaSCcvs5MP48dFGgGz';
const creds = 'TestUser:2Asf27dDVcvd8sd1dfSfd';

const optAuth = () => {
    const hash = Buffer.from(creds).toString('base64').toString();
    return {
        headers: { 'Authorization': 'Basic ' + hash}
    }
};

const partnerAuth = () => {
    return {
        headers: { 'X-API-KEY': key1}
    }
};

exports.optAuth = optAuth;
exports.partnerAuth = partnerAuth;
exports.key2 = key2;