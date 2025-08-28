const express = require('express');
const router = express.Router();
const productionService = require('./production.service');

// Yeni bir üretim partisi başlat
router.post('/start-batch', async (req, res) => {
    try {
        const { pcb_id, quantity_produced } = req.body;
        const newBatch = await productionService.startProductionBatch(pcb_id, quantity_produced);
        res.status(201).json({ message: 'Üretim partisi başarıyla başlatıldı ve stoklar güncellendi.', batch: newBatch });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/plan/:pcbId', async (req, res) => {
    try {
        const { pcbId } = req.params;
        const plan = await productionService.generateProductionPlan(pcbId);
        if (plan.length === 0) {
            return res.status(404).json({ message: 'Bu PCB için plan verisi bulunamadı.' });
        }
        res.json({ plan });
    } catch (error) {
        console.error('Plan oluşturulurken hata:', error.message);
        res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
    }
});

router.get('/full-plan/:pcbId', async (req, res) => {
    try {
        const { pcbId } = req.params;
        const plan = await productionService.generateDetailedProductionPlan(pcbId);
        if (plan.length === 0) {
            return res.status(404).json({ message: 'Bu PCB için plan verisi bulunamadı.' });
        }
        res.json({ plan });
    } catch (error) {
        console.error('Detaylı plan oluşturulurken hata:', error.message);
        res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
    }
});

module.exports = router;