// src/modules/auth/auth.repository.js
const { query } = require('../../config/database');

const findUserByUsername = async (username) => {
    try {
        const result = await query('SELECT * FROM inventory.users WHERE username = $1', [username]);
        return result.rows[0]; // Kullanıcı bulunursa, ilk satırı döndür
    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        throw new Error('Kullanıcı veritabanından alınamadı.');
    }
};

module.exports = {
    findUserByUsername
};