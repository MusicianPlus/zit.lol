const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Middlewares
app.use(cors({
  origin: 'https://zit.lol',
  credentials: true,
}));
app.use(express.json());

// Manuel cookie-parser (hata düzeltilmiş versiyonu)
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
    req.cookies = cookies;
  } else {
    // Çerez başlığı yoksa, req.cookies'i boş bir nesne olarak tanımla
    req.cookies = {};
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

module.exports = app;