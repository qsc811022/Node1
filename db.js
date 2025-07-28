const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'Admin1',
  password: process.env.DB_PASSWORD || 'Ab1',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'LunchBox1',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

async function getRequest() {
  await poolConnect;
  return pool.request();
}

module.exports = {
  sql,
  pool,
  poolConnect,
  getRequest
};
