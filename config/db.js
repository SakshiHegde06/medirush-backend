const mysql = require("mysql2/promise")

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Sak@24680",
  database: process.env.DB_NAME || "medirush_db",
  waitForConnections: true,
  connectionLimit: 10,
})

pool.query("SELECT 1")
  .then(() => console.log("MySQL connected successfully"))
  .catch(err => console.error("MySQL connection failed:", err.message))

module.exports = pool
