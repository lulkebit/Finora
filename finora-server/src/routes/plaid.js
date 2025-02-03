const express = require('express');
const router = express.Router();
const {
    createLinkToken,
    exchangePublicToken,
    client,
} = require('../config/plaid');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

// Route zum Erstellen eines Link-Tokens
router.post('/create-link-token', verifyToken, async (req, res) => {
    try {
        const createTokenResponse = await createLinkToken(req.user.id);
        res.json(createTokenResponse);
    } catch (error) {
        console.error('Error in /create-link-token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route zum Austauschen des Public Tokens
router.post('/set-access-token', verifyToken, async (req, res) => {
    try {
        const { public_token } = req.body;
        const exchangeResponse = await exchangePublicToken(public_token);

        // Speichere den Access Token in der Datenbank
        await db.query(
            'UPDATE users SET plaid_access_token = $1 WHERE id = $2',
            [exchangeResponse.access_token, req.user.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error in /set-access-token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route zum Abrufen von Kontodetails
router.get('/accounts', verifyToken, async (req, res) => {
    try {
        // Hole den Access-Token des Benutzers aus der Datenbank
        const result = await db.query(
            'SELECT plaid_access_token FROM users WHERE id = $1',
            [req.user.id]
        );

        if (!result.rows[0]?.plaid_access_token) {
            return res.status(400).json({
                error: 'Kein Plaid Access-Token gefunden. Bitte verbinden Sie zuerst ein Bankkonto.',
            });
        }

        const accessToken = result.rows[0].plaid_access_token;
        const response = await client.accountsGet({
            access_token: accessToken,
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
