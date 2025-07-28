const express = require('express');
const { db } = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/today', authenticate, (req, res) => {
  db.all('SELECT * FROM Menus WHERE AvailableDate = date("now")', (err, rows) => {
    if (err) return res.status(400).json({});
    res.json(rows);
  });
});

router.post('/', authenticate, adminOnly, (req, res) => {
  const { name, price, availableDate } = req.body;
  const stmt = db.prepare('INSERT INTO Menus (Name, Price, AvailableDate) VALUES (?,?,?)');
  stmt.run(name, price, availableDate, function(err) {
    if (err) return res.status(400).json({});
    res.json({ id: this.lastID });
  });
});

router.put('/:id', authenticate, adminOnly, (req, res) => {
  const { name, price, availableDate } = req.body;
  db.run('UPDATE Menus SET Name=?, Price=?, AvailableDate=? WHERE Id=?', [name, price, availableDate, req.params.id], function(err) {
    if (err || this.changes === 0) return res.status(400).json({});
    res.json({ message: 'Updated' });
  });
});

router.delete('/:id', authenticate, adminOnly, (req, res) => {
  db.run('DELETE FROM Menus WHERE Id=?', [req.params.id], function(err) {
    if (err || this.changes === 0) return res.status(400).json({});
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
