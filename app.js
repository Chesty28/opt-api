// Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ordersRoutes = require('./routes/orders');
const stateFetching = require('./utils/state-fetching');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use('/api/orders', ordersRoutes);

app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Server
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:KWOBsuq9gTQbR0dj@cluster0.vpfqb.mongodb.net/opt-api?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => app.listen(process.env.PORT || 5000, () => console.log('Server is listening on port 5000')))
.catch(err => console.log(err));