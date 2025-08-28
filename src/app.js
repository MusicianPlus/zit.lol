const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Middlewares (servera yüklerken origin: 'https://zit.lol',)
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

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
