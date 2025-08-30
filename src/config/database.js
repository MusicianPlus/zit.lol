const knex = require('knex');
require('dotenv').config();

const db = knex({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false
    },
  },
  pool: {
    min: 2,
    max: 10
  },
  searchPath: ['inventory', 'public'],
});

module.exports = db;