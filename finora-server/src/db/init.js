const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres', // Verbindung zur Standard-Datenbank
});

async function initDatabase() {
    const client = await pool.connect();

    try {
        // Prüfen ob Datenbank existiert
        const dbExists = await client.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [process.env.DB_NAME]
        );

        // Wenn nicht, erstellen
        if (dbExists.rows.length === 0) {
            console.log(`Erstelle Datenbank ${process.env.DB_NAME}...`);
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        }

        // Verbindung zur neuen Datenbank
        await client.end();

        const dbPool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
        });

        const dbClient = await dbPool.connect();

        // Schema-Datei lesen und ausführen
        console.log('Erstelle Tabellen...');
        const schema = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );
        await dbClient.query(schema);

        console.log('Datenbank-Initialisierung abgeschlossen!');
        process.exit(0);
    } catch (err) {
        console.error('Fehler bei der Datenbank-Initialisierung:', err);
        process.exit(1);
    }
}

initDatabase();
