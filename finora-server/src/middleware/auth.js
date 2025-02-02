const jwt = require('jsonwebtoken');
const { logger, logSecurity } = require('../config/logger');

const verifyToken = (req, res, next) => {
    const token =
        req.headers['authorization']?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        logSecurity('auth_failure', 'medium', {
            reason: 'no_token',
            path: req.originalUrl,
        });
        return res.status(401).json({
            error: 'Kein Authentifizierungs-Token vorhanden',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        logSecurity('auth_failure', 'high', {
            reason: 'invalid_token',
            error: err.message,
            path: req.originalUrl,
        });
        return res.status(401).json({
            error: 'Ungültiger oder abgelaufener Token',
        });
    }
};

const optionalAuth = (req, res, next) => {
    const token =
        req.headers['authorization']?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next();
    }
};

module.exports = {
    verifyToken,
    optionalAuth,
};
