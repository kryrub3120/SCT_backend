const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const predictionRoutes = require('./routes/predictionsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Trasy API
app.use('/api/predictions', predictionRoutes);

module.exports = app;