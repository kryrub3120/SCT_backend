const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const predictionRoutes = require('./routes/predictionsRoutes');
app.use('/api', predictionRoutes);

module.exports = app;