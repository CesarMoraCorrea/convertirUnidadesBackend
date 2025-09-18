const axios = require('axios');

// Conversiones de tiempo
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

// Conversiones de peso
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

// Controlador para conversión de tiempo
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

// Controlador para conversión de peso
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

// Controlador para conversión de temperatura
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

// Cache para tasas de cambio
let currencyRatesCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 1 hora en milisegundos

// Tasas de cambio fijas como respaldo
const fallbackRates = {
  USD: { EUR: 0.85, MXN: 17.5, CHF: 0.92 },
  EUR: { USD: 1.18, MXN: 20.6, CHF: 1.08 },
  MXN: { USD: 0.057, EUR: 0.048, CHF: 0.052 },
  CHF: { USD: 1.09, EUR: 0.93, MXN: 19.2 }
};

// Función para obtener tasas de cambio actualizadas
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

// Controlador para obtener tasas de cambio
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

// Controlador para conversión de moneda
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

module.exports = {
  convertTime,
  convertWeight,
  convertTemperature,
  convertCurrency,
  getCurrencyRates
};