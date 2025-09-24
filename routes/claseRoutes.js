const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:usuario', async (req, res, next) => {
  try {
    const [clases] = await pool.query('SELECT * FROM clase WHERE usuario_maestro = ?', [req.params.usuario]);      
    res.json(clases);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {
        usuario_maestro,
        nombre,
        descripcion        
    } = req.body;
    
    if (!usuario_maestro || !nombre) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO clase (usuario_maestro, nombre, descripcion) VALUES (?, ?, ?)',
      [usuario_maestro, nombre, descripcion]
    );
    
    res.status(201).json({
        id:result.insertId,
        nombre,
        message: 'Clase creada correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;