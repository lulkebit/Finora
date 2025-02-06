const express = require('express');
const router = express.Router();
const {
    createLinkToken,
    exchangePublicToken,
    client,
} = require('../config/plaid');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');
const { DateTime } = require('luxon');

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

// Route zum Abrufen der Dashboard-Übersicht
router.get('/dashboard/overview', verifyToken, async (req, res) => {
    try {
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

        // Hole Konten und Transaktionen
        const [accountsResponse, transactionsResponse] = await Promise.all([
            client.accountsGet({
                access_token: accessToken,
            }),
            client.transactionsGet({
                access_token: accessToken,
                start_date: DateTime.now().minus({ days: 30 }).toISODate(),
                end_date: DateTime.now().toISODate(),
            }),
        ]);

        // Berechne Kontostand (Summe aller Konten)
        const balance = accountsResponse.data.accounts.reduce(
            (sum, account) => sum + account.balances.current,
            0
        );

        // Berechne monatliche Ausgaben
        const monthlyExpenses = transactionsResponse.data.transactions
            .filter((t) => t.amount > 0) // Plaid verwendet positive Werte für Ausgaben
            .reduce((sum, t) => sum + t.amount, 0);

        // Berechne Sparquote (Einnahmen - Ausgaben) / Einnahmen * 100
        const income = transactionsResponse.data.transactions
            .filter((t) => t.amount < 0) // Plaid verwendet negative Werte für Einnahmen
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const savingsRate =
            income > 0
                ? Math.round(((income - monthlyExpenses) / income) * 100)
                : 0;

        res.json({
            balance,
            monthlyExpenses,
            savingsRate,
        });
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route zum Abrufen der Transaktionen
router.get('/transactions', verifyToken, async (req, res) => {
    try {
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
        const response = await client.transactionsGet({
            access_token: accessToken,
            start_date: DateTime.now().minus({ days: 30 }).toISODate(),
            end_date: DateTime.now().toISODate(),
        });

        // Formatiere die Transaktionen
        const transactions = response.data.transactions.map((t) => ({
            id: t.transaction_id,
            description: t.name,
            date: DateTime.fromISO(t.date).toFormat('dd.MM.yyyy'),
            amount: t.amount * -1, // Konvertiere Plaid's Format (positiv = Ausgabe) in unser Format (negativ = Ausgabe)
        }));

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route zum Abrufen der Kategorien
router.get('/categories', verifyToken, async (req, res) => {
    try {
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
        const response = await client.transactionsGet({
            access_token: accessToken,
            start_date: DateTime.now().minus({ days: 30 }).toISODate(),
            end_date: DateTime.now().toISODate(),
        });

        // Gruppiere Transaktionen nach Kategorien
        const categoryMap = new Map();
        response.data.transactions.forEach((t) => {
            if (t.amount > 0) {
                // Nur Ausgaben
                const category = t.category[0] || 'Sonstiges';
                const currentAmount = categoryMap.get(category) || 0;
                categoryMap.set(category, currentAmount + t.amount);
            }
        });

        const categories = Array.from(categoryMap.entries()).map(
            ([name, amount]) => ({
                name,
                amount,
            })
        );

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route zum Abrufen der Verträge
router.get('/contracts', verifyToken, async (req, res) => {
    try {
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
        const response = await client.transactionsGet({
            access_token: accessToken,
            start_date: DateTime.now().minus({ days: 90 }).toISODate(),
            end_date: DateTime.now().toISODate(),
        });

        // Identifiziere wiederkehrende Transaktionen
        const transactions = response.data.transactions;
        const recurringTransactions = new Map();

        transactions.forEach((t) => {
            const key = `${t.name}-${Math.round(Math.abs(t.amount))}`;
            const existing = recurringTransactions.get(key) || [];
            existing.push({
                date: DateTime.fromISO(t.date),
                amount: t.amount,
            });
            recurringTransactions.set(key, existing);
        });

        // Analysiere Häufigkeit und erstelle Verträge
        const contracts = [];
        let id = 1;

        recurringTransactions.forEach((transactions, key) => {
            if (transactions.length >= 2) {
                // Mindestens 2 Vorkommen
                const [name] = key.split('-');
                const amount = transactions[0].amount * -1; // Konvertiere zu unserem Format
                const dates = transactions.map((t) => t.date);

                // Bestimme das Intervall
                const intervals = dates
                    .slice(1)
                    .map((date, i) =>
                        Math.round(date.diff(dates[i], 'days').days)
                    );
                const avgInterval =
                    intervals.reduce((a, b) => a + b, 0) / intervals.length;

                let interval;
                if (avgInterval <= 32) interval = 'monthly';
                else if (avgInterval <= 95) interval = 'quarterly';
                else interval = 'yearly';

                // Bestimme die Kategorie
                let category = 'subscription';
                if (amount > 0) category = 'income';
                else if (name.toLowerCase().includes('versicherung'))
                    category = 'insurance';
                else if (
                    name.toLowerCase().includes('strom') ||
                    name.toLowerCase().includes('gas') ||
                    name.toLowerCase().includes('wasser')
                )
                    category = 'utility';

                // Berechne nächstes Zahlungsdatum
                const lastDate = dates[dates.length - 1];
                let nextPayment;
                if (interval === 'monthly')
                    nextPayment = lastDate.plus({ months: 1 });
                else if (interval === 'quarterly')
                    nextPayment = lastDate.plus({ months: 3 });
                else nextPayment = lastDate.plus({ years: 1 });

                contracts.push({
                    id: id++,
                    name,
                    category,
                    amount,
                    interval,
                    nextPayment: nextPayment.toFormat('dd.MM.yyyy'),
                    provider: name,
                });
            }
        });

        res.json(contracts);
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route zum Entfernen eines einzelnen Bankkontos
router.delete('/unlink-account/:accountId', verifyToken, async (req, res) => {
    try {
        const { accountId } = req.params;
        const result = await db.query(
            'SELECT plaid_access_token FROM users WHERE id = $1',
            [req.user.id]
        );

        if (!result.rows[0]?.plaid_access_token) {
            return res.status(400).json({
                error: 'Kein Plaid Access-Token gefunden.',
            });
        }

        const accessToken = result.rows[0].plaid_access_token;

        // Hole aktuelle Konten
        const accountsResponse = await client.accountsGet({
            access_token: accessToken,
        });

        // Prüfe ob das Konto existiert
        const accountExists = accountsResponse.data.accounts.some(
            (account) => account.account_id === accountId
        );

        if (!accountExists) {
            return res.status(404).json({
                error: 'Konto nicht gefunden.',
            });
        }

        // Entferne das Konto bei Plaid
        await client.accountsRemove({
            access_token: accessToken,
            account_ids: [accountId],
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error unlinking account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
