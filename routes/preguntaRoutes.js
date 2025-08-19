const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/listado/:prueba', async (req, res, next) => {
  try {
    const [preguntas] = await pool.query('SELECT * FROM pregunta WHERE id_prueba = ?', [req.params.prueba]);
    res.json(preguntas);
  } catch (error) {
    next(error);
  }
});

router.get('/:pregunta', async (req, res, next) => {
  try {
    const [pregunta] = await pool.query('SELECT * FROM pregunta WHERE id_pregunta = ?', [req.params.pregunta]);      
    if (pregunta.length === 0) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }
    res.json(pregunta[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {          
        id_prueba,
        tipo,
        pregunta
    } = req.body;
    
    if (!id_prueba || !tipo || !pregunta) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO pregunta (id_prueba, tipo, pregunta) VALUES (?, ?, ?)',
      [id_prueba, tipo, pregunta]
    );
    
    res.status(201).json({
      id:result.insertId,   
      id_prueba,      
      message: '¡Pregunta creada correctamente!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;