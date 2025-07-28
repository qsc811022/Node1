const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, poolConnect } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  await poolConnect;
  const { username, password } = req.body;
  try {
    const result = await sql.query`SELECT Id, PasswordHash, Role FROM Users WHERE Username = ${username}`;
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.recordset[0];
    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.Id, role: user.Role }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
