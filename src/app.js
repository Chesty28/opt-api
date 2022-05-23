// Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const ordersRoutes = require('./routes/orders');
const stateFetching = require('./services/state-fetching');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use('/api/orders', ordersRoutes);

app.use((req, res) => {
	res.status(404).send('Page not found');
});

// Server
const port = process.env.PORT || 5000;
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() =>
		app.listen(port, () => console.log('Server is listening on port ' + port))
	)
	.catch((err) => console.log(err));
