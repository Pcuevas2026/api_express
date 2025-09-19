const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/llave/:llave_secreta', async (req, res, next) => {
  try {
    const [prueba] = await pool.query('SELECT * FROM prueba WHERE llave_secreta = ?', [req.params.llave_secreta]);
    res.json(prueba);
  } catch (error) {
    next(error);
  }
});

router.get('/:clase', async (req, res, next) => {
  try {
    const [pruebas] = await pool.query('SELECT * FROM prueba WHERE id_clase = ?', [req.params.clase]);
    res.json(pruebas);
  } catch (error) {
    next(error);
  }
});

router.get('/jugar/:prueba/:alumno', async (req, res, next) => { 
  try {
    const [rows] = await pool.query(
      `
      SELECT        
        pre.id_pregunta,        
        pre.tipo,
        pre.pregunta
      FROM prueba pru
      INNER JOIN pregunta pre
        ON pre.id_prueba = pru.id_prueba
      INNER JOIN respuesta res
        ON res.id_pregunta = pre.id_pregunta      
      WHERE
        pru.id_prueba = ?
        and res.id_alumno = ?
        and res.respuesta IS NULL
      `,
      [req.params.prueba, req.params.alumno]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const {
        id_clase,
        nombre,
        descripcion,
        llave_secreta,
        fecha_creacion        
    } = req.body;
    
    if (!id_clase || !nombre || !llave_secreta || !fecha_creacion) {
      return res.status(400).json({ error: '¡Faltan campos requeridos!' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO prueba (id_clase, nombre, descripcion, llave_secreta, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      [id_clase, nombre, descripcion, llave_secreta, fecha_creacion]
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