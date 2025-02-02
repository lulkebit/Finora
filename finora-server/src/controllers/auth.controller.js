const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logger, logAuth, logSecurity } = require('../config/logger');

const register = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        employmentStatus,
        monthlyIncome,
        savingsGoal,
        riskTolerance,
    } = req.body;

    try {
        // E-Mail-Format überprüfen
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
        }

        // Passwort-Anforderungen überprüfen
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    error: 'Passwort muss mindestens 8 Zeichen lang sein',
                });
        }

        // Prüfen, ob E-Mail bereits existiert
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            logAuth('register_attempt', null, false, {
                reason: 'email_exists',
                email,
            });
            return res
                .status(409)
                .json({ error: 'E-Mail-Adresse bereits registriert' });
        }

        // Passwort hashen
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Transaktion starten
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Benutzer erstellen
            const userResult = await client.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
                [email, passwordHash]
            );
            const userId = userResult.rows[0].id;

            // Benutzerprofil erstellen
            await client.query(
                `INSERT INTO user_profiles 
                (user_id, first_name, last_name, date_of_birth, employment_status, monthly_income, savings_goal, risk_tolerance)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    userId,
                    firstName,
                    lastName,
                    dateOfBirth,
                    employmentStatus,
                    monthlyIncome,
                    savingsGoal,
                    riskTolerance,
                ]
            );

            await client.query('COMMIT');

            // JWT Token erstellen
            const token = jwt.sign(
                { id: userId, email },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            );

            logAuth('register_success', userId, true, { email });
            res.status(201).json({
                message: 'Registrierung erfolgreich',
                token,
                user: {
                    id: userId,
                    email,
                    firstName,
                    lastName,
                },
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        logger.error(`Registrierungsfehler: ${err.message}`);
        logAuth('register_error', null, false, { error: err.message });
        res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Benutzer finden
        const result = await db.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            logAuth('login_attempt', null, false, {
                reason: 'user_not_found',
                email,
            });
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }

        const user = result.rows[0];

        // Passwort überprüfen
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );
        if (!validPassword) {
            logAuth('login_attempt', user.id, false, {
                reason: 'invalid_password',
            });
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }

        // Letzten Login aktualisieren
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // JWT Token erstellen
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h',
            }
        );

        // Benutzerprofil abrufen
        const profileResult = await db.query(
            'SELECT first_name, last_name FROM user_profiles WHERE user_id = $1',
            [user.id]
        );

        const userProfile = profileResult.rows[0] || {};

        logAuth('login_success', user.id, true, { email });
        res.json({
            message: 'Login erfolgreich',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: userProfile.first_name,
                lastName: userProfile.last_name,
            },
        });
    } catch (err) {
        logger.error(`Login-Fehler: ${err.message}`);
        logAuth('login_error', null, false, { error: err.message });
        res.status(500).json({ error: 'Login fehlgeschlagen' });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await db.query('UPDATE users SET email_verified = true WHERE id = $1', [
            decoded.id,
        ]);

        logAuth('email_verification', decoded.id, true);
        res.json({ message: 'E-Mail erfolgreich verifiziert' });
    } catch (err) {
        logger.error(`E-Mail-Verifizierungsfehler: ${err.message}`);
        logAuth('email_verification', null, false, { error: err.message });
        res.status(400).json({
            error: 'Ungültiger oder abgelaufener Verifizierungstoken',
        });
    }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await db.query('SELECT id FROM users WHERE email = $1', [
            email,
        ]);

        if (result.rows.length === 0) {
            // Aus Sicherheitsgründen geben wir die gleiche Nachricht zurück
            return res.json({
                message:
                    'Wenn ein Account mit dieser E-Mail existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.',
            });
        }

        const user = result.rows[0];
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // TODO: E-Mail-Versand implementieren
        logAuth('password_reset_requested', user.id, true, { email });
        res.json({
            message:
                'Wenn ein Account mit dieser E-Mail existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.',
        });
    } catch (err) {
        logger.error(
            `Fehler beim Anfordern des Passwort-Resets: ${err.message}`
        );
        logAuth('password_reset_request', null, false, { error: err.message });
        res.status(500).json({
            error: 'Fehler beim Anfordern des Passwort-Resets',
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (newPassword.length < 8) {
            return res
                .status(400)
                .json({
                    error: 'Passwort muss mindestens 8 Zeichen lang sein',
                });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
            passwordHash,
            decoded.id,
        ]);

        logAuth('password_reset_success', decoded.id, true);
        res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
    } catch (err) {
        logger.error(`Fehler beim Zurücksetzen des Passworts: ${err.message}`);
        logAuth('password_reset', null, false, { error: err.message });
        res.status(400).json({ error: 'Ungültiger oder abgelaufener Token' });
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
};
