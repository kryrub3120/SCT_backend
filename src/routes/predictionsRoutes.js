const express = require('express');
const { getPredictions, createPrediction } = require('../controllers/predictionsController');

const router = express.Router();

router.get('/', getPredictions); // Pobieranie historii predykcji
router.post('/', createPrediction); // Tworzenie nowej predykcji

module.exports = router;