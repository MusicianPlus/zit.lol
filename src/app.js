const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Middlewares (servera yüklerken origin: 'https://zit.lol',)
app.use(cors({
  origin: 'https://zit.lol',
  credentials: true,
}));
app.use(express.json());

// Manuel cookie-parser (sadece token'ı ayrıştırmak için)
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
    req.cookies = cookies;
  }
  next();
});

// Modül router'ları 
const stockRoutes = require('./modules/stock-management/stock.controller');
const bomRoutes = require('./modules/bom-management/bom.controller');
const procurementRoutes = require('./modules/procurement/procurement.controller');
const importerRoutes = require('./modules/importer/importer.controller');
const productionRoutes = require('./modules/production/production.controller');
const componentRoutes = require('./modules/component-management/component.controller');
const pcbRoutes = require('./modules/pcb-management/pcb.controller');
const authRoutes = require('./modules/auth/auth.routes'); 

// Rota tanımlamaları
app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/bom', bomRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/importer', importerRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/pcb', pcbRoutes);

// Statik front-end dosyalarını sunma kısmı kaldırıldı.
// Bu kısım production'da ayrı bir sunucu (örneğin Nginx) veya
// aynı sunucuda farklı bir port üzerinden sunulmalıdır.

module.exports = app;
