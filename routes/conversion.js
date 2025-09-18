const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');

// Rutas para conversión de tiempo
router.post('/time', conversionController.convertTime);

// Rutas para conversión de peso
router.post('/weight', conversionController.convertWeight);

// Rutas para conversión de temperatura
router.post('/temperature', conversionController.convertTemperature);

// Rutas para conversión de moneda
router.post('/currency', conversionController.convertCurrency);

// Ruta para obtener tasas de cambio actualizadas
router.get('/currency/rates', conversionController.getCurrencyRates);

module.exports = router;