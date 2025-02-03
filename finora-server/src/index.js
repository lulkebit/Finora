const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const { logger, httpLogger } = require('./config/logger');
const authRoutes = require('./routes/auth.routes');
const plaidRoutes = require('./routes/plaid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogger); // HTTP-Logging Middleware

// Basis-Route
app.get('/', (req, res) => {
    logger.info('Basis-Route aufgerufen');
    res.json({ message: 'Willkommen bei der Finora API' });
});

// Auth-Routen
app.use('/api/auth', authRoutes);

// Plaid-Routen
app.use('/api/plaid', plaidRoutes);

// API Status-Route
app.get('/api/status', async (req, res) => {
    try {
        // Test der Datenbankverbindung
        await db.query('SELECT NOW()');
        logger.info('Erfolgreicher Datenbank-Verbindungstest');
        res.json({
            status: 'online',
            timestamp: new Date().toISOString(),
            database: 'verbunden',
        });
    } catch (err) {
        logger.error(`Datenbankfehler: ${err.message}`);
        res.status(500).json({
            status: 'online',
            timestamp: new Date().toISOString(),
            database: 'nicht verbunden',
            error: err.message,
        });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Unbehandelter Fehler: ${err.stack}`);
    res.status(500).json({
        error: 'Ein interner Serverfehler ist aufgetreten',
    });
});

// Server starten mit verbesserter Fehlerbehandlung
const server = app
    .listen(port, () => {
        logger.info(`Server läuft auf Port ${port}`);
    })
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            logger.error(
                `Port ${port} ist bereits in Verwendung. Bitte wählen Sie einen anderen Port in der .env Datei.`
            );
            process.exit(1);
        } else {
            logger.error('Server Fehler:', err);
            process.exit(1);
        }
    });

// Graceful Shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM Signal empfangen. Server wird heruntergefahren...');
    server.close(() => {
        logger.info('Server wurde sauber heruntergefahren');
        process.exit(0);
    });
});
