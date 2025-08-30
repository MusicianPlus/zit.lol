const createStockService = require('./stock.service');
const stockRepository = require('./stock.repository');

const stockService = createStockService(stockRepository);

module.exports = stockService;
