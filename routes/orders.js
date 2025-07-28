const express = require('express');
const { sql, poolConnect } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  await poolConnect;
  const userId = req.user.id;
  const { menuId, note } = req.body;
  try {
    await sql.query`INSERT INTO Orders (UserId, MenuId, OrderDate, Note) VALUES (${userId}, ${menuId}, GETDATE(), ${note})`;
    res.json({ message: 'Order placed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/mine', auth, async (req, res) => {
  await poolConnect;
  const userId = req.user.id;
  try {
    const result = await sql.query`SELECT * FROM Orders WHERE UserId = ${userId}`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
