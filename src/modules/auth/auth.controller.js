const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const authService = require('./auth.container');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../../shared/errors');
const validator = require('../../shared/middleware/validator');
const { loginSchema } = require('./auth.validators');
// src/modules/auth/auth.controller.js
const { authenticateUser } = require('./auth.service');
const jwt = require('jsonwebtoken');

const loginUser = asyncHandler(async (req, res) => {
    const { username, password, rememberMe } = req.body;

    const token = await authService.authenticateUser(username, password, rememberMe);
    
    res.cookie('auth-token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None', 
        domain: '.zit.lol'
    });

    res.status(200).json({ message: 'Giriş başarılı.' });
});

const logoutUser = (req, res) => {
    res.clearCookie('auth-token');
    res.status(200).json({ message: 'Çıkış yapıldı.' });
};

const verifyToken = (req, res, next) => {
    const token = req.cookies['auth-token'];

    if (!token) {
        throw new UnauthorizedError('Yetkilendirme token\'ı bulunamadı.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new UnauthorizedError('Geçersiz veya süresi dolmuş token.');
    }
};

const checkAuthStatus = (req, res) => {
    res.status(200).json({ message: 'Kullanıcı giriş yapmış.', user: req.user });
};

<<<<<<< HEAD
router.post('/login', validator(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/verify', verifyToken, checkAuthStatus);

module.exports = router;
=======
module.exports = {
    loginUser,
    logoutUser,
    verifyToken,
    checkAuthStatus
};
>>>>>>> 7e2785e2fadb66f37f1cf3ee857b7552b02c4254
