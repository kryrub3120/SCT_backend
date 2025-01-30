const express = require('express');
const { getPredictions, makePrediction } = require('../controllers/predictionsController');

const router = express.Router();

router.get('/predictions', getPredictions);
router.post('/predict', makePrediction);

module.exports = router;