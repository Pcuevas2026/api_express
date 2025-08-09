const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:clase', async (req, res, next) => {
  try {
    const [pruebas] = await pool.query('SELECT * FROM prueba WHERE id_clase = ?', [req.params.clase]);
    res.json(pruebas);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {       
        id_clase,   
        nombre,
        descripcion
    } = req.body;
    
    if (!id_clase || !nombre) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO prueba (id_clase, nombre, descripcion) VALUES (?, ?, ?)',
      [id_clase, nombre, descripcion]
    );
    
    res.status(201).json({      
      id:result.insertId,  
      nombre,    
      message: '¡Prueba creada correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;