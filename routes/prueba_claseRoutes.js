const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:clase', async (req, res, next) => {
  try {
    const [pruebas] = await pool.query('SELECT * FROM prueba_clase WHERE id_clase = ?', [req.params.clase]);
    res.json(pruebas);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {
        id_prueba,
        id_clase
    } = req.body;
    
    if (!id_prueba || !id_clase) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    await pool.query(
      'INSERT INTO prueba_clase (id_prueba, id_clase) VALUES (?, ?)',
      [id_prueba, id_clase]
    );
    
    res.status(201).json({              
      id_prueba,
      id_clase,
      message: '¡Prueba asignada a clase correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;