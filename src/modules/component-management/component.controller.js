const express = require('express');
const router = express.Router();
const componentService = require('./component.service');

// `components` tablosunun sütunlarını döndürür
router.get('/columns', async (req, res) => {
    try {
        const columns = await componentService.getComponentColumns();
        res.json(columns);
    } catch (error) {
        console.error('Sütunları alma hatası:', error);
        res.status(500).json({ message: 'Sütunlar alınırken bir hata oluştu.' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const components = await componentService.getAllComponents();
        res.status(200).json(components);
    } catch (error) {
        console.error('Tüm komponentleri getirme hatası:', error);
        res.status(500).json({ message: 'Komponentler alınırken bir hata oluştu.' });
    }
});

module.exports = router;