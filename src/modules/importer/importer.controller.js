const express = require('express');
const multer = require('multer');
const importerService = require('./importer.service');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Yeni ve esnek dosya yükleme endpoint'i
router.post('/upload-file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Lütfen bir dosya yükleyin.' });
    }
    
    try {
        const file = req.file;
        const processedData = await importerService.processFile(file.path, file.mimetype);
        
        res.json({
            message: 'Dosya başarıyla okundu ve işlendi.',
            data: processedData
        });
    } catch (error) {
        res.status(500).json({ message: 'Dosya işlenirken bir hata oluştu.', error: error.message });
    }
});

module.exports = router;