const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:prueba', async (req, res, next) => {
  try {
    const [prueba] = await pool.query('SELECT * FROM prueba WHERE id_prueba = ?', [req.params.prueba]);
    if (prueba.length === 0) {
      return res.status(404).json({ message: 'Prueba no encontrada' });
    }
    res.json(prueba[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {          
        nombre,
        descripcion
    } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO prueba (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
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