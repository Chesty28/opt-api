const key1 = process.env.KEY1;
const key2 = process.env.KEY2;
const creds = process.env.CREDS;
const hash = Buffer.from(creds).toString('base64').toString();

const optAuth = () => {
	return {
		headers: { Authorization: 'Basic ' + hash },
	};
};

const partnerAuth = () => {
	return {
		headers: { 'X-API-KEY': key2 },
	};
};

const checkPartnerAuth = (req, res, next) => {
	if (req.headers['x-api-key'] === key1) {
		next();
	} else {
		return res.sendStatus(401);
	}
};

exports.checkPartnerAuth = checkPartnerAuth;
exports.optAuth = optAuth;
exports.partnerAuth = partnerAuth;
exports.key2 = key2;
