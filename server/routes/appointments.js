import express from 'express';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = 'titkos_jwt_kulcs';

// JWT ellenőrző middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, authData) => {
      if (err) return res.sendStatus(403);
      req.user = authData;
      next();
    });
  } else {
    res.sendStatus(403);
  }
}

// Időpont létrehozása (nyilvános)
router.post('/', async (req, res) => {
  const { name, email, phone, datetime, contact } = req.body;
  try {
    await pool.query(
      'INSERT INTO appointments (name, email, phone, datetime, contact) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, datetime, contact]
    );
    res.json({ message: 'Sikeres foglalás!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Adatbázis hiba!' });
  }
});

// Időpontok lekérése (admin jogosultság szükséges)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Adatbázis hiba!' });
  }
});

// Időpont törlése (admin jogosultság szükséges)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Törölve!' });
  } catch (err) {
    res.status(500).json({ message: 'Adatbázis hiba!' });
  }
});

export default router;