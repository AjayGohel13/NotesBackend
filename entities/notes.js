


const connection = require("./db");

async function createUserTable() {
    try {
        await connection.query(`
  CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  note TEXT NOT NULL,
  userId INTEGER NOT NULL
)
`);
    } catch (err) {
        console.error("Failed to initialize notes table:", err);
    }
}

module.exports = createUserTable;
