import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Probar conexión
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err);
    } else {
        console.log('✅ PostgreSQL conectado:', res.rows);
    }
});

export default pool;

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            provider TEXT DEFAULT 'local',
            provider_id TEXT,
            role TEXT DEFAULT 'cliente',
            photo_url TEXT,
            reset_token TEXT,
            reset_token_expires DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'pendiente',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        status TEXT DEFAULT 'pendiente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


    db.run(`ALTER TABLE users ADD COLUMN reset_token TEXT`, (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error("Error agregando reset_token:", err.message);
        }
    });

    db.run(`ALTER TABLE users ADD COLUMN reset_token_expires DATETIME`, (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error("Error agregando reset_token_expires:", err.message);
        }
    });
});

module.exports = db;