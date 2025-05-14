import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const SECRET = 'titkos_jwt_kulcs';

// Egyszerű memória-alapú tárolás
let appointments = [];

// Middleware a token ellenőrzéséhez
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

// Időpontok lekérése (admin jogosultság szükséges)
router.get('/', verifyToken, (req, res) => {
  res.json(appointments);
});

// Időpont létrehozása (nyilvános)
router.post('/', (req, res) => {
  appointments.push(req.body);
  res.json({ message: 'Sikeres foglalás!' });
});

// Időpont törlése (admin jogosultság szükséges)
router.delete('/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  appointments = appointments.filter((_, idx) => idx !== Number(id));
  res.json({ message: 'Törölve!' });
});

export default router;