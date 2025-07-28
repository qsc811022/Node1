const express = require('express');
const { db } = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, (req, res) => {
  const { menuId, note } = req.body;
  const stmt = db.prepare('INSERT INTO Orders (UserId, MenuId, OrderDate, Note) VALUES (?,?,date("now"),?)');
  stmt.run(req.user.id, menuId, note || '', function(err) {
    if (err) return res.status(400).json({ message: 'Failed to order' });
    res.json({ message: 'Ordered' });
  });
});

router.get('/mine', authenticate, (req, res) => {
  db.all('SELECT * FROM Orders WHERE UserId = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(400).json({});
    res.json(rows);
  });
});

router.get('/today', authenticate, adminOnly, (req, res) => {
  db.all('SELECT * FROM Orders WHERE OrderDate = date("now")', (err, rows) => {
    if (err) return res.status(400).json({});
    res.json(rows);
  });
});

router.delete('/:id', authenticate, (req, res) => {
  db.run('DELETE FROM Orders WHERE Id = ? AND UserId = ?', [req.params.id, req.user.id], function(err) {
    if (err || this.changes === 0) return res.status(400).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
