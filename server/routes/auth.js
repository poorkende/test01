import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = 'titkos_jwt_kulcs';
const ADMIN = { username: 'admin', password: 'admin123' };

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Hibás adatok' });
  }
});

export default router;