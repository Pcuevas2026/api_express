const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:clase', async (req, res, next) => {
    try {
      const [alumnos] = await pool.query('SELECT * FROM clase_alumno WHERE id_clase = ?', [req.params.clase]);      
      res.json(alumnos);
    } catch (error) {
      next(error);
    }
  });

  router.post('/create', async (req, res, next) => {
    try {
      const {          
          id_clase,
          id_alumno       
      } = req.body;
      
      if (!id_clase || !id_alumno) {
        return res.status(400).json({ error: '¡Faltan campos requeridos!' });
      }
      
      await pool.query(
        'INSERT INTO clase_alumno (id_clase, id_alumno) VALUES (?, ?)',
        [id_clase, id_alumno]
      );
      
      res.status(201).json({              
        id_clase,
        id_alumno,
        message: '¡Alumno asignado a clase correctamente!'
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;