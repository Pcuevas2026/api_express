const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:clase', async (req, res, next) => {
    try {
      const [alumnos] = await pool.query('SELECT * FROM clase_alumno WHERE id_clase = ?', [req.params.clase]);
      if (alumnos.length === 0) {
        return res.status(404).json({ message: 'Esta clase no tiene ningún alumno asignado' });
      }
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
        'INSERT INTO alumno (id_clase, id_alumno) VALUES (?, ?)',
        [id_clase, id_alumno]
      );
      
      res.status(201).json({              
        id_clase,
        id_alumno,
        message: 'Registro creado correctamente!'
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;