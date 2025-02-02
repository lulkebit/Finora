const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Test der Datenbankverbindung
pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Fehler bei der Verbindung zur Datenbank:',
            err.stack
        );
    }
    console.log('Erfolgreich mit der Datenbank verbunden');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
