import db from '../config/db.js';

export const getAppointments = (req, res) => {
  const sql = "SELECT * FROM appointments";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};

export const createAppointment = (req, res) => {
  const { datetime, name, email, phone, contact } = req.body;

  const sql = "INSERT INTO appointments (datetime, name, email, phone, contact) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [datetime, name, email, phone, contact], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Időpont sikeresen hozzáadva", result });
  });
};

export const deleteAppointment = (req, res) => {
  const id = req.params.id;  // Az ID-t paraméterként várjuk

  const sql = "DELETE FROM appointments WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows > 0) {
      res.send({ message: "Törlés sikeres", affectedRows: result.affectedRows });
    } else {
      res.status(404).send({ message: "Az időpont nem található" });
    }
  });
};