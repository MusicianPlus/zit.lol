
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
require('dotenv').config();

// Port numarasını ortam değişkeninden alın
const PORT = process.env.PORT || 3000;

// Veritabanı bağlantısını kur
connectDB()
  .then(() => {
    // Veritabanı bağlantısı başarılıysa sunucuyu başlat
    http.createServer(app).listen(PORT, '0.0.0.0', () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error('Sunucu başlatılamadı:', err.message || err);
  });