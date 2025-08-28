const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
    ssl: {
    rejectUnauthorized: false
  },
  options: '-c search_path=inventory'
});

// Veritabanı bağlantısını test etmek için bir fonksiyon
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Veritabanına başarıyla bağlanıldı.');
    client.release(); // Bağlantıyı havuza geri gönder
  } catch (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
    process.exit(1); // Bağlantı kurulamadıysa uygulamayı sonlandır
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  connectDB,
};