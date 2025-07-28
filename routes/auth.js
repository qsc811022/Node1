const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { secret } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password, fullName, department, extension } = req.body;
  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO Users (Username, PasswordHash, FullName, Department, Extension) VALUES (?,?,?,?,?)');
  stmt.run(username, hash, fullName, department, extension, function(err) {
    if (err) {
      return res.status(400).json({ message: 'User exists' });
    }
    res.json({ message: 'Registered' });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM Users WHERE Username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.PasswordHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.Id, role: user.Role, username: user.Username }, secret);
    res.json({ token });
  });
});

module.exports = router;
