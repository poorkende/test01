import db from '../config/db.js';

export const login = (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Szerver hiba' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
    }

    // sikeres bejelentkezés
    res.status(200).json({ message: 'Sikeres bejelentkezés', user: results[0] });
  });
};
