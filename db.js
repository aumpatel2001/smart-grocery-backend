const mysql = require("mysql2/promise");
const fs = require("fs");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync("certs/ca.pem"),
  },
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;