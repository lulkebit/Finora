const winston = require('winston');
const path = require('path');

// Log-Level-Definitionen
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Log-Level basierend auf der Umgebung
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};

// Log-Farben für bessere Lesbarkeit
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(colors);

// Log-Format definieren
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Transporter konfigurieren
const transports = [
    // Konsolen-Output
    new winston.transports.Console(),

    // Fehler-Logs in separate Datei
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error',
    }),

    // Alle Logs
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/all.log'),
    }),

    // HTTP-Anfragen separat loggen
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/http.log'),
        level: 'http',
    }),

    // Sicherheitsrelevante Logs
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/security.log'),
        level: 'warn',
    }),

    // Finanz-Transaktionen
    new winston.transports.File({
        filename: path.join(__dirname, '../logs/transactions.log'),
        level: 'info',
    }),
];

// Logger erstellen
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

// Middleware für HTTP-Logging
const httpLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(
            `${req.method} ${req.originalUrl} ${
                res.statusCode
            } ${duration}ms | IP: ${req.ip} | User-Agent: ${req.get(
                'user-agent'
            )}`
        );
    });
    next();
};

// Spezielle Logger-Funktionen für verschiedene Bereiche
const logAuth = (type, userId, success, details = {}) => {
    const message = {
        type,
        userId,
        success,
        timestamp: new Date().toISOString(),
        ...details,
    };
    logger.log({
        level: success ? 'info' : 'warn',
        message: JSON.stringify(message),
    });
};

const logTransaction = (userId, type, amount, details = {}) => {
    const message = {
        userId,
        type,
        amount,
        timestamp: new Date().toISOString(),
        ...details,
    };
    logger.info(JSON.stringify(message));
};

const logContract = (userId, action, contractId, details = {}) => {
    const message = {
        userId,
        action,
        contractId,
        timestamp: new Date().toISOString(),
        ...details,
    };
    logger.info(JSON.stringify(message));
};

const logSecurity = (type, severity, details = {}) => {
    const message = {
        type,
        severity,
        timestamp: new Date().toISOString(),
        ...details,
    };
    logger.warn(JSON.stringify(message));
};

module.exports = {
    logger,
    httpLogger,
    logAuth,
    logTransaction,
    logContract,
    logSecurity,
};
