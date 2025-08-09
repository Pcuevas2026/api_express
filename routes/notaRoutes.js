const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/create', async (req, res, next) => {
  try {
    const {          
        id_alumno,
        id_prueba
    } = req.body;
    
    if (!id_alumno || !id_prueba) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    await pool.query(
      'INSERT INTO nota (id_alumno, id_prueba) VALUES (?, ?)',
      [id_alumno, id_prueba]
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