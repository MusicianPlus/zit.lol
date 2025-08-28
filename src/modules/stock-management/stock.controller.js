const express = require('express');
const router = express.Router();
const stockService = require('./stock.service');

// Tüm stok kalemlerini getir
router.get('/', async (req, res) => {
  try {
    const stockItems = await stockService.getAllStock();
    res.json(stockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stoğa yeni bileşen ekle veya mevcut bileşenin miktarını artır
router.post('/', async (req, res) => {
  try {
    const { component_id, quantity } = req.body;
    const newStock = await stockService.addStock(component_id, quantity);
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bir bileşenin stok miktarını ayarla (güncelle)
router.put('/:component_id', async (req, res) => {
  try {
    const { component_id } = req.params;
    const { new_quantity } = req.body;

    const updatedStock = await stockService.setStockQuantity(component_id, new_quantity);
    res.json(updatedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bir bileşeni stoktan sil
router.delete('/:component_id', async (req, res) => {
  try {
    const { component_id } = req.params;
    const deletedStock = await stockService.deleteStock(component_id);
    res.json({ message: 'Stok kalemi başarıyla silindi.', deletedStock });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;