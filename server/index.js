const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json()); // FONTOS: ez kell a JSON body-hoz!

const SECRET = 'titkos_jwt_kulcs';

// Dummy user
const ADMIN = { username: 'admin', password: 'admin123' };

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Hibás adatok' });
  }
});

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

// Védett admin végpont (példa)
app.get('/api/admin', verifyToken, (req, res) => {
  res.json({ message: 'Csak adminnak!' });
});

// Időpontok (appointments) végpontok
let appointments = [];

app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  appointments.push(req.body);
  res.json({ message: 'Sikeres foglalás!' });
});

app.delete('/api/appointments/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  appointments = appointments.filter((_, idx) => idx !== Number(id));
  res.json({ message: 'Törölve!' });
});

app.listen(5000, () => console.log('Szerver fut a 5000-es porton'));