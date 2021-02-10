const express = require('express');
const bodyParser = require('body-parser');

const ordersRoutes = require('./routes/orders');

const app = express();

app.use(bodyParser.json());

app.use('/api/orders', ordersRoutes);

app.use((req, res) => {
    res.status(404).send('Page was not found');
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'Unknow error'});
});

app.listen(5000);