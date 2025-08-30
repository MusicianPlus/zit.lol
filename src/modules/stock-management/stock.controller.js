const express = require('express');
const router = express.Router();
const stockService = require('./stock.container');
const asyncHandler = require('express-async-handler');
const validator = require('../../shared/middleware/validator');
const { addStockSchema, setStockQuantitySchema } = require('./stock.validators');

// Tüm stok kalemlerini getir
router.get('/', asyncHandler(async (req, res) => {
    const stockItems = await stockService.getAllStock();
    res.json(stockItems);
}));

// Stoğa yeni bileşen ekle veya mevcut bileşenin miktarını artır
router.post('/', validator(addStockSchema), asyncHandler(async (req, res) => {
    const { component_id, quantity } = req.body;
    const newStock = await stockService.addStock(component_id, quantity);
    res.status(201).json(newStock);
}));

// Bir bileşenin stok miktarını ayarla (güncelle)
router.put('/:component_id', validator(setStockQuantitySchema), asyncHandler(async (req, res) => {
    const { component_id } = req.params;
    const { new_quantity } = req.body;

    const updatedStock = await stockService.setStockQuantity(component_id, new_quantity);
    res.json(updatedStock);
}));

// Bir bileşeni stoktan sil
router.delete('/:component_id', asyncHandler(async (req, res) => {
    const { component_id } = req.params;
    const deletedStock = await stockService.deleteStock(component_id);
    res.json({ message: 'Stok kalemi başarıyla silindi.', deletedStock });
}));

module.exports = router;