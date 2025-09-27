const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/alumnos/:prueba', async (req, res, next) => {
  try {
    const [alumnos] = await pool.query(
      `SELECT 
         n.id_alumno,
         replace(concat(al.primer_nombre, ' ',  al.segundo_nombre, ' ', al.primer_apellido, ' ', al.segundo_apellido),'  ',' ') as nombre_alumno,
         n.nota,
         IFNULL(res.completadas,0) as completadas
       FROM nota n
       INNER JOIN alumno al ON al.id_alumno = n.id_alumno
       LEFT JOIN(
        SELECT
          id_alumno
          ,COUNT(1) as completadas
        FROM respuesta
        WHERE id_pregunta IN(
          SELECT id_pregunta
          FROM pregunta
          WHERE id_prueba = ?
        )
        and respuesta IS NOT NULL
        GROUP BY id_alumno
      ) as res
        ON res.id_alumno = n.id_alumno
       WHERE n.id_prueba = ?`,
      [req.params.prueba, req.params.prueba]
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