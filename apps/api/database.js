const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Probar conexión
pool.query("SELECT NOW()", (err) => {
    if (err) {
        console.error("❌ Error conectando a PostgreSQL:", err.message);
    } else {
        console.log("✅ PostgreSQL conectado correctamente");
    }
});

module.exports = pool;