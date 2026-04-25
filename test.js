const mysql = require("mysql2/promise");
require("dotenv").config();

async function test() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await pool.query("SELECT 1");

    console.log("DB OK:", rows);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
}

test();
