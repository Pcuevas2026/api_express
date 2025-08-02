const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:usuario', async (req, res, next) => {
  try {
    const [maestro] = await pool.query('SELECT * FROM maestro WHERE usuario = ?', [req.params.usuario]);
    if (maestro.length === 0) {
      return res.status(404).json({ message: 'Maestro no encontrado' });
    }
    res.json(maestro[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {
        usuario,
        clave,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido
    } = req.body;
    
    if (!usuario || !clave || !primer_nombre || !primer_apellido) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    await pool.query(
      'INSERT INTO maestro (usuario, clave, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario, clave, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido]
    );
    
    res.status(201).json({        
      usuario,
      message: '¡Usuario creado correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;