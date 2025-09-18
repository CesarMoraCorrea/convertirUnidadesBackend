/**
 * Controlador de conversiones de unidades
 * 
 * Este archivo contiene toda la lógica para convertir diferentes tipos de unidades:
 * - Tiempo (segundos, minutos, horas, días, meses, años)
 * - Peso (gramos, kilogramos, libras, onzas, toneladas)
 * - Temperatura (Celsius, Fahrenheit, Kelvin)
 * - Moneda (usando API externa para tasas de cambio en tiempo real)
 */

const axios = require('axios');

// ============================================================================
// CONFIGURACIONES DE CONVERSIÓN
// ============================================================================

/**
 * Conversiones de tiempo
 * 
 * Objeto que contiene todas las funciones de conversión entre unidades de tiempo.
 * Cada unidad tiene funciones para convertir a todas las demás unidades.
 */
const timeConversions = {
  segundos: {
    minutos: (value) => value / 60,
    horas: (value) => value / 3600,
    dias: (value) => value / 86400,
    meses: (value) => value / 2629746,
    años: (value) => value / 31556952
  },
  minutos: {
    segundos: (value) => value * 60,
    horas: (value) => value / 60,
    dias: (value) => value / 1440,
    meses: (value) => value / 43829.1,
    años: (value) => value / 525949
  },
  horas: {
    segundos: (value) => value * 3600,
    minutos: (value) => value * 60,
    dias: (value) => value / 24,
    meses: (value) => value / 730.484,
    años: (value) => value / 8765.81
  },
  dias: {
    segundos: (value) => value * 86400,
    minutos: (value) => value * 1440,
    horas: (value) => value * 24,
    meses: (value) => value / 30.4368,
    años: (value) => value / 365.242
  },
  meses: {
    segundos: (value) => value * 2629746,
    minutos: (value) => value * 43829.1,
    horas: (value) => value * 730.484,
    dias: (value) => value * 30.4368,
    años: (value) => value / 12
  },
  años: {
    segundos: (value) => value * 31556952,
    minutos: (value) => value * 525949,
    horas: (value) => value * 8765.81,
    dias: (value) => value * 365.242,
    meses: (value) => value * 12
  }
};

/**
 * Conversiones de peso
 * 
 * Objeto que contiene todas las funciones de conversión entre unidades de peso.
 * Incluye conversiones métricas e imperiales comunes.
 */
const weightConversions = {
  gramos: {
    kilogramos: (value) => value / 1000,
    libras: (value) => value * 0.00220462
  },
  kilogramos: {
    gramos: (value) => value * 1000,
    libras: (value) => value * 2.20462
  },
  libras: {
    gramos: (value) => value / 0.00220462,
    kilogramos: (value) => value / 2.20462
  }
};

// Conversiones de temperatura
const temperatureConversions = {
  celsius: {
    fahrenheit: (value) => (value * 9/5) + 32,
    kelvin: (value) => value + 273.15
  },
  fahrenheit: {
    celsius: (value) => (value - 32) * 5/9,
    kelvin: (value) => ((value - 32) * 5/9) + 273.15
  },
  kelvin: {
    celsius: (value) => value - 273.15,
    fahrenheit: (value) => ((value - 273.15) * 9/5) + 32
  }
};

// (Las conversiones de temperatura ya están definidas arriba en el código)

// ============================================================================
// FUNCIONES DEL CONTROLADOR
// ============================================================================

/**
 * Controlador para conversión de tiempo
 * 
 * Maneja las peticiones POST para convertir unidades de tiempo.
 * Valida los parámetros de entrada y realiza la conversión correspondiente.
 * 
 * @param {Object} req - Objeto de petición con body: {value, from, to}
 * @param {Object} res - Objeto de respuesta
 */
const convertTime = (req, res) => {
  try {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
    
    if (from === to) {
      return res.json({ result: value });
    }
    
    if (!timeConversions[from] || !timeConversions[from][to]) {
      return res.status(400).json({ error: 'Conversión no válida' });
    }
    
    const result = timeConversions[from][to](parseFloat(value));
    res.json({ result: parseFloat(result.toFixed(10)) });
  } catch (error) {
    res.status(500).json({ error: 'Error en la conversión de tiempo' });
  }
};

/**
 * Controlador para conversión de peso
 * 
 * Maneja las peticiones POST para convertir unidades de peso.
 * Valida los parámetros de entrada y realiza la conversión correspondiente.
 * 
 * @param {Object} req - Objeto de petición con body: {value, from, to}
 * @param {Object} res - Objeto de respuesta
 */
const convertWeight = (req, res) => {
  try {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
    
    if (from === to) {
      return res.json({ result: value });
    }
    
    if (!weightConversions[from] || !weightConversions[from][to]) {
      return res.status(400).json({ error: 'Conversión no válida' });
    }
    
    const result = weightConversions[from][to](parseFloat(value));
    res.json({ result: parseFloat(result.toFixed(10)) });
  } catch (error) {
    res.status(500).json({ error: 'Error en la conversión de peso' });
  }
};

/**
 * Controlador para conversión de temperatura
 * 
 * Maneja las peticiones POST para convertir unidades de temperatura.
 * Soporta conversiones entre Celsius, Fahrenheit y Kelvin.
 * 
 * @param {Object} req - Objeto de petición con body: {value, from, to}
 * @param {Object} res - Objeto de respuesta
 */
const convertTemperature = (req, res) => {
  try {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
    
    if (from === to) {
      return res.json({ result: value });
    }
    
    if (!temperatureConversions[from] || !temperatureConversions[from][to]) {
      return res.status(400).json({ error: 'Conversión no válida' });
    }
    
    const result = temperatureConversions[from][to](parseFloat(value));
    res.json({ result: parseFloat(result.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ error: 'Error en la conversión de temperatura' });
  }
};

// ============================================================================
// CONFIGURACIÓN DE MONEDA
// ============================================================================

/**
 * Cache para tasas de cambio
 * 
 * Variables para almacenar en memoria las tasas de cambio y evitar
 * peticiones excesivas a la API externa.
 */
let currencyRatesCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 1 hora en milisegundos

/**
 * Tasas de cambio fijas como respaldo
 * 
 * Se utilizan cuando la API externa no está disponible o falla.
 * Estas tasas deben actualizarse periódicamente en producción.
 */
const fallbackRates = {
  USD: { EUR: 0.85, MXN: 17.5, CHF: 0.92 },
  EUR: { USD: 1.18, MXN: 20.6, CHF: 1.08 },
  MXN: { USD: 0.057, EUR: 0.048, CHF: 0.052 },
  CHF: { USD: 1.09, EUR: 0.93, MXN: 19.2 }
};

/**
 * Función para obtener tasas de cambio actualizadas
 * 
 * Realiza una petición a la API externa para obtener las tasas de cambio
 * más recientes. Incluye manejo de errores y cache para optimizar rendimiento.
 * 
 * @returns {Object} Objeto con las tasas de cambio actualizadas
 */
const fetchCurrencyRates = async () => {
  try {
    // Usar API gratuita de exchangerate-api como ejemplo
    // En producción, considera usar una API más robusta
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    
    const rates = {
      USD: {
        EUR: response.data.rates.EUR,
        MXN: response.data.rates.MXN,
        CHF: response.data.rates.CHF
      },
      EUR: {
        USD: 1 / response.data.rates.EUR,
        MXN: response.data.rates.MXN / response.data.rates.EUR,
        CHF: response.data.rates.CHF / response.data.rates.EUR
      },
      MXN: {
        USD: 1 / response.data.rates.MXN,
        EUR: response.data.rates.EUR / response.data.rates.MXN,
        CHF: response.data.rates.CHF / response.data.rates.MXN
      },
      CHF: {
        USD: 1 / response.data.rates.CHF,
        EUR: response.data.rates.EUR / response.data.rates.CHF,
        MXN: response.data.rates.MXN / response.data.rates.CHF
      }
    };
    
    currencyRatesCache = rates;
    lastFetchTime = Date.now();
    return rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error.message);
    return fallbackRates;
  }
};

/**
 * Controlador para obtener tasas de cambio
 * 
 * Endpoint GET que devuelve las tasas de cambio actuales.
 * Utiliza cache para evitar peticiones excesivas a la API externa.
 * 
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta con las tasas y timestamp
 */
const getCurrencyRates = async (req, res) => {
  try {
    const now = Date.now();
    
    if (!currencyRatesCache || !lastFetchTime || (now - lastFetchTime) > CACHE_DURATION) {
      currencyRatesCache = await fetchCurrencyRates();
    }
    
    res.json({ rates: currencyRatesCache, lastUpdated: lastFetchTime });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo tasas de cambio' });
  }
};

/**
 * Controlador para conversión de moneda
 * 
 * Maneja las peticiones POST para convertir entre diferentes monedas.
 * Utiliza tasas de cambio en tiempo real y devuelve el resultado con metadatos.
 * 
 * @param {Object} req - Objeto de petición con body: {value, from, to}
 * @param {Object} res - Objeto de respuesta con resultado, tasa y timestamp
 */
const convertCurrency = async (req, res) => {
  try {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
    
    if (from === to) {
      return res.json({ result: value });
    }
    
    const now = Date.now();
    
    if (!currencyRatesCache || !lastFetchTime || (now - lastFetchTime) > CACHE_DURATION) {
      currencyRatesCache = await fetchCurrencyRates();
    }
    
    if (!currencyRatesCache[from] || !currencyRatesCache[from][to]) {
      return res.status(400).json({ error: 'Conversión de moneda no válida' });
    }
    
    const rate = currencyRatesCache[from][to];
    const result = parseFloat(value) * rate;
    
    res.json({ 
      result: parseFloat(result.toFixed(2)),
      rate: rate,
      lastUpdated: lastFetchTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en la conversión de moneda' });
  }
};

// ============================================================================
// EXPORTACIÓN DE MÓDULOS
// ============================================================================

/**
 * Exporta todas las funciones del controlador para ser utilizadas en las rutas.
 * 
 * Cada función maneja un tipo específico de conversión:
 * - convertTime: Conversiones de tiempo
 * - convertWeight: Conversiones de peso
 * - convertTemperature: Conversiones de temperatura
 * - convertCurrency: Conversiones de moneda
 * - getCurrencyRates: Obtención de tasas de cambio
 */
module.exports = {
  convertTime,
  convertWeight,
  convertTemperature,
  convertCurrency,
  getCurrencyRates
};