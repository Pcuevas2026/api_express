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
         res.es_correcta
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
        es_correcta
    } = req.body;
    
    if (!id_alumno || !id_pregunta) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    await pool.query(
      'INSERT INTO respuesta (id_alumno, id_pregunta, respuesta, es_correcta) VALUES (?, ?, ?, ?)',
      [id_alumno, id_pregunta, respuesta, es_correcta]
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

router.put('/respuesta/:id_alumno/:id_pregunta/:id_prueba', async (req, res, next) => {
  try {
    const { id_alumno, id_pregunta, id_prueba } = req.params;
    const { respuesta, es_correcta } = req.body;

    if (respuesta === undefined) {
      return res.status(400).json({ error: 'Debes enviar el campo respuesta' });
    }

    await pool.query(
      `UPDATE respuesta 
       SET respuesta = ?, es_correcta = ?
       WHERE id_alumno = ? AND id_pregunta = ?`,
      [respuesta, es_correcta, id_alumno, id_pregunta]
    );

    // Actualizar nota también
    
    const [notaCalc] = await pool.query(
      `
      SELECT
        COUNT(CASE WHEN es_correcta = 1 THEN respuesta END) as correctas
      FROM respuesta
      WHERE id_alumno = ?
      AND id_pregunta IN(
        SELECT id_pregunta
        FROM pregunta
        WHERE id_prueba = ?
      )
      `,
      [id_alumno, id_prueba]
    );

    const correctas = notaCalc[0].correctas;

    await pool.query(
      `UPDATE nota 
       SET nota = ? 
       WHERE id_alumno = ? AND id_prueba = ?`,
      [correctas, id_alumno, id_prueba]
    );

    res.json({
      message: '¡Respuesta actualizada correctamente!',
      id_alumno,
      id_pregunta,
      respuesta
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;