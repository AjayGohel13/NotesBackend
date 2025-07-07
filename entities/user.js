const connection = require("./db");

async function createUserTable() {
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        signup_date DATE NOT NULL
      )
    `);
  } catch (err) {
    console.error("Failed to initialize users table:", err);
  }
}

module.exports = createUserTable;
