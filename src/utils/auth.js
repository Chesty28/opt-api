const key1 = process.env.KEY1;
const key2 = process.env.KEY2;
const creds = process.env.CREDS;

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