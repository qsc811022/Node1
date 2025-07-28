const express = require('express');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const { poolConnect } = require('./db');

const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);

const port = process.env.PORT || 3000;

poolConnect.then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection failed', err);
});
