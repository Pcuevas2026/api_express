const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:alumno', async (req, res, next) => {
    try {
      const [alumno] = await pool.query('SELECT * FROM alumno WHERE id_alumno = ?', [req.params.alumno]);
      if (alumno.length === 0) {
        return res.status(404).json({ message: 'Alumno no encontrado' });
      }
      res.json(alumno[0]);
    } catch (error) {
      next(error);
    }
  });

  router.post('/create', async (req, res, next) => {
    try {
      const {          
          primer_nombre,
          segundo_nombre,
          primer_apellido,
          segundo_apellido
      } = req.body;
      
      if (!primer_nombre || !primer_apellido) {
        return res.status(400).json({ error: '¡Faltan campos requeridos!' });
      }
      
      const [result] = await pool.query(
        'INSERT INTO alumno (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido) VALUES (?, ?, ?, ?)',
        [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido]
      );
      
      res.status(201).json({      
        id:result.insertId,  
        primer_nombre,
        primer_apellido,
        message: 'Alumno creado correctamente!'
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;