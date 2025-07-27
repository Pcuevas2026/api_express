const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT * FROM user');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;