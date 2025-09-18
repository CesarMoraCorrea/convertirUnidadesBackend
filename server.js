const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const conversionRoutes = require('./routes/conversion');

// Usar rutas
app.use('/api/conversion', conversionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Conversión de Unidades funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;