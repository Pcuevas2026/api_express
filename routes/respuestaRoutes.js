const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/alumno/:alumno/prueba/:prueba', async (req, res, next) => {
  try {
    const [alumnos] = await pool.query(
      `SELECT 
         p.tipo,
         p.pregunta,
         res.respuesta,
         res.puntaje
       FROM pregunta p
       INNER JOIN respuesta res 
          ON res.id_pregunta = p.id_pregunta 
          AND res.id_alumno = ? 
       WHERE p.id_prueba = ?`,
      [req.params.alumno, req.params.prueba]
    );

    res.json(alumnos);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {          
        id_alumno,
        id_pregunta,
        respuesta,
        puntaje
    } = req.body;
    
    if (!id_alumno || !id_pregunta) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    await pool.query(
      'INSERT INTO respuesta (id_alumno, id_pregunta, respuesta, puntaje) VALUES (?, ?, ?, ?)',
      [id_alumno, id_pregunta, respuesta, puntaje]
    );
    
    res.status(201).json({      
      id_alumno,
      id_pregunta,
      message: '¡Respuesta de alumno creada correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;