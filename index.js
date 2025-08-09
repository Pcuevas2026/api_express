const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const clase_alumnoRoutes = require('./routes/clase_alumnoRoutes');
const claseRoutes = require('./routes/claseRoutes');
const maestroRoutes = require('./routes/maestroRoutes');
const notaRoutes = require('./routes/notaRoutes');
const preguntaRoutes = require('./routes/preguntaRoutes');
const pruebaRoutes = require('./routes/pruebaRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/alumnos', alumnoRoutes);
app.use('/clases_alumnos', clase_alumnoRoutes);
app.use('/clases', claseRoutes);
app.use('/maestros', maestroRoutes);
app.use('/notas', notaRoutes);
app.use('/preguntas', preguntaRoutes);

app.use('/pruebas', pruebaRoutes);

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