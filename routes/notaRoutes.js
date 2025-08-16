const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/alumnos/:prueba', async (req, res, next) => {
  try {
    const [alumnos] = await pool.query('SELECT * FROM nota WHERE id_prueba = ?', [req.params.prueba]);      
    res.json(alumnos);
  } catch (error) {
    next(error);
  }
});

router.get('/pruebas/:alumno', async (req, res, next) => {
  try {
    const [pruebas] = await pool.query('SELECT * FROM nota WHERE id_alumno = ?', [req.params.alumno]);      
    res.json(pruebas);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {          
        id_alumno,
        id_prueba,
        nota
    } = req.body;
    
    if (!id_alumno || !id_prueba) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    await pool.query(
      'INSERT INTO nota (id_alumno, id_prueba, nota) VALUES (?, ?, ?)',
      [id_alumno, id_prueba, nota]
    );
    
    res.status(201).json({              
      id_alumno,
      id_prueba,
      message: '¡Nota de alumno creada correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;