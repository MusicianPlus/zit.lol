const express = require('express');
const router = express.Router();
const bomService = require('./bom.service');

// Yeni bir PCB ve BOM oluştur
router.post('/', async (req, res) => {
    try {
        const { pcb_name, description, components } = req.body;
        const newBom = await bomService.createPcbAndBom(pcb_name, description, components);
        res.status(201).json(newBom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Bir PCB'nin BOM'unu getir
router.get('/:pcb_id', async (req, res) => {
    try {
        const { pcb_id } = req.params;
        const bomDetails = await bomService.getBomDetails(pcb_id);
        if (bomDetails.length === 0) {
            return res.status(404).json({ message: 'BOM not found for this PCB.' });
        }
        res.json(bomDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bir BOM bileşenini sil
router.delete('/:bom_id', async (req, res) => {
    try {
        const { bom_id } = req.params;
        const deletedItem = await bomService.deleteBomItem(bom_id);
        res.json({ message: 'BOM item deleted successfully.', deletedItem });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;