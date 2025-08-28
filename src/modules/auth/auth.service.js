// src/modules/auth/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('./auth.repository');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const authenticateUser = async (username, password, rememberMe) => {
    // 1. Repository'yi kullanarak kullanıcıyı bul
    const user = await findUserByUsername(username);

    if (!user) {
        throw new Error('Kullanıcı adı veya şifre yanlış.');
    }

    // 2. Şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Kullanıcı adı veya şifre yanlış.');
    }

    // 3. Token için dinamik bitiş süresi belirle
    const expiresIn = rememberMe ? '30d' : '1h';

    // 4. JWT Token oluştur
    const tokenPayload = { id: user.id, username: user.username };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

    return token;
};

module.exports = {
    authenticateUser
};