const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const maestroRoutes = require('./routes/maestroRoutes');
const claseRoutes = require('./routes/claseRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const clase_alumnoRoutes = require('./routes/clase_alumnoRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/maestros', maestroRoutes);
app.use('/clases', claseRoutes);
app.use('/alumnos', alumnoRoutes);
app.use('/clases_alumnos', clase_alumnoRoutes);

app.get('/', (req, res) => {
  res.json({ message: '¡Bienvenido a la API del ESP32!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '¡Algo salió mal!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});