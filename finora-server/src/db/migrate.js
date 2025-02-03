const db = require('../config/db');
const { logger } = require('../config/logger');

async function migrate() {
    try {
        // Füge plaid_access_token Spalte hinzu
        await db.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS plaid_access_token VARCHAR(255)
        `);

        logger.info('Migration erfolgreich ausgeführt');
        process.exit(0);
    } catch (error) {
        logger.error('Fehler bei der Migration:', error);
        process.exit(1);
    }
}

migrate();
