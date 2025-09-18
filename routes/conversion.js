/**
 * Rutas de conversión de unidades
 * 
 * Este archivo define todas las rutas de la API para las conversiones de unidades.
 * Cada ruta está conectada con su respectivo controlador que maneja la lógica de negocio.
 * 
 * Endpoints disponibles:
 * - POST /api/conversion/time - Conversión de unidades de tiempo
 * - POST /api/conversion/weight - Conversión de unidades de peso
 * - POST /api/conversion/temperature - Conversión de unidades de temperatura
 * - POST /api/conversion/currency - Conversión de monedas
 * - GET /api/conversion/currency/rates - Obtener tasas de cambio actuales
 */

const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');

// ============================================================================
// RUTAS DE CONVERSIÓN
// ============================================================================

/**
 * Ruta para conversión de tiempo
 * POST /time
 * Body: { value: number, from: string, to: string }
 * Unidades soportadas: segundos, minutos, horas, dias, meses, años
 */
router.post('/time', conversionController.convertTime);

/**
 * Ruta para conversión de peso
 * POST /weight
 * Body: { value: number, from: string, to: string }
 * Unidades soportadas: gramos, kilogramos, libras, onzas, toneladas
 */
router.post('/weight', conversionController.convertWeight);

/**
 * Ruta para conversión de temperatura
 * POST /temperature
 * Body: { value: number, from: string, to: string }
 * Unidades soportadas: celsius, fahrenheit, kelvin
 */
router.post('/temperature', conversionController.convertTemperature);

/**
 * Ruta para conversión de moneda
 * POST /currency
 * Body: { value: number, from: string, to: string }
 * Monedas soportadas: USD, EUR, MXN, CHF
 */
router.post('/currency', conversionController.convertCurrency);

/**
 * Ruta para obtener tasas de cambio actualizadas
 * GET /currency/rates
 * Devuelve las tasas de cambio actuales con timestamp de última actualización
 */
router.get('/currency/rates', conversionController.getCurrencyRates);

// ============================================================================
// EXPORTACIÓN
// ============================================================================

/**
 * Exporta el router con todas las rutas configuradas
 * para ser utilizado en el servidor principal
 */
module.exports = router;