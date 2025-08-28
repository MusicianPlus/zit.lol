// src/modules/auth/auth.routes.js
const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, checkAuthStatus, verifyToken } = require('./auth.controller');

// login rotası
router.post('/login', loginUser);

// logout rotası
router.post('/logout', logoutUser);

// Oturum durumu kontrol rotası (verifyToken ile korunuyor)
router.get('/verify', verifyToken, checkAuthStatus);

module.exports = router;