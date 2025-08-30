// src/modules/auth/auth.repository.js
const db = require('../../config/database');

const findUserByUsername = async (username) => {
    const user = await db('inventory.users').where({ username }).first();
    return user;
};

module.exports = {
    findUserByUsername
};