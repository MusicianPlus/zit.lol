const express = require('express');
const router = express.Router();
const procurementService = require('./procurement.service');

// Yeni bir tedarikçi ekle
router.post('/suppliers', async (req, res) => {
    try {
        const newSupplier = await procurementService.addSupplier(req.body);
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Yeni bir sipariş oluştur ve detaylarını ekle
router.post('/orders', async (req, res) => {
    try {
        const { supplier_id, items } = req.body;
        const newOrder = await procurementService.createFullOrder(supplier_id, items);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Tüm siparişleri listele
router.get('/orders', async (req, res) => {
    try {
        const orders = await procurementService.getAllOrdersWithSuppliers();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Belirli bir siparişin detaylarını getir
router.get('/orders/:order_id/details', async (req, res) => {
    try {
        const { order_id } = req.params;
        const orderDetails = await procurementService.getOrderWithDetails(order_id);
        res.json(orderDetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.post('/process-order', async (req, res) => {
    try {
        const { data, mapping, supplierName } = req.body;
        if (!data || !mapping) {
            return res.status(400).json({ message: 'Eksik veya hatalı veri gönderildi.' });
        }
        const results = await procurementService.processAndSaveOrder(data, mapping, supplierName);
        res.json({ message: 'Sipariş başarıyla işlendi ve stok güncellendi.', summary: results });
    } catch (error) {
        console.error('Sipariş işleme hatası:', error);
        res.status(500).json({ message: 'Sipariş işleme sırasında bir hata oluştu.', error: error.message });
    }
});

module.exports = router;