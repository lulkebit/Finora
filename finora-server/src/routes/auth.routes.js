const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

// Öffentliche Routen
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/password-reset-request', authController.requestPasswordReset);
router.post('/password-reset', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Geschützte Routen (erfordern Token)
router.get('/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
