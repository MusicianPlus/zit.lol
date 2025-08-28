// pcb.controller.js dosyanızın GÜNCELLENMİŞ HALİ
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs/promises');
const pcbService = require('./pcb.service');
const importerService = require('../importer/importer.service'); // Bu import'u koru

// Dosya yükleme için geçici bir dizin ayarla
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Yeni bir PCB oluşturur
router.post('/create-pcb', async (req, res) => {
    try {
        const { pcbName } = req.body;
        if (!pcbName) {
            return res.status(400).json({ message: 'PCB adı eksik.' });
        }
        
        const newPcb = await pcbService.createPcb(pcbName);
        res.status(201).json({ message: 'PCB başarıyla oluşturuldu.', pcb: newPcb });
    } catch (error) {
        console.error('PCB oluşturma hatası:', error);
        res.status(500).json({ message: 'PCB oluşturulurken bir hata oluştu.' });
    }
});

// BOM dosyası yükleme endpoint'i (tab, UTF-16LE)
router.post('/upload-bom', upload.single('bomFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'BOM dosyası yüklenmedi.' });
        }
        
        const filePath = req.file.path;
        const fileMimeType = req.file.mimetype;

        const bomData = await importerService.processFile(filePath, fileMimeType, {
            separator: '\t',
            encoding: 'utf16le'
        });
        
        res.status(200).json({ bomData: bomData });
    } catch (error) {
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path);
        }
        console.error('BOM yükleme ve ayrıştırma hatası:', error);
        res.status(500).json({ message: 'BOM dosyası işlenirken bir hata oluştu.' });
    }
});

// Eşleştirilmiş BOM verilerini veritabanına kaydeder (eski fonksiyon, kullanılmıyor olabilir)
router.post('/save-mapped-bom', async (req, res) => {
    try {
        const { pcbId, bomData } = req.body;
        if (!pcbId || !bomData || !Array.isArray(bomData) || bomData.length === 0) {
            return res.status(400).json({ message: 'Geçersiz PCB ID veya BOM verisi.' });
        }
        
        await pcbService.saveMappedBom(pcbId, bomData);
        
        res.status(200).json({ message: 'BOM verileri başarıyla kaydedildi.' });
    } catch (error) {
        console.error('Eşleştirilmiş BOM kaydetme hatası:', error);
        res.status(500).json({ message: 'Eşleştirme verileri kaydedilirken bir hata oluştu.' });
    }
});

// Tüm PCB'leri döndürür
router.get('/', async (req, res) => {
    try {
        const pcbs = await pcbService.getAllPcbs();
        res.status(200).json(pcbs);
    } catch (error) {
        console.error('Tüm PCB\'leri getirme hatası:', error);
        res.status(500).json({ message: 'PCB\'ler alınırken bir hata oluştu.' });
    }
});

// Yeni BOM verilerini kaydeder (gruplanmış verilerle)
router.post('/save-bom', async (req, res) => {
    try {
        const { pcbId, bomData } = req.body;
        await pcbService.savePcbBom(pcbId, bomData);
        res.status(200).json({ message: 'BOM verileri başarıyla kaydedildi.' });
    } catch (error) {
        console.error('BOM kaydetme hatası:', error.message);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Bir PCB'ye ait eşleştirilmiş BOM verilerini döndürür
router.get('/:id/mapped-bom', async (req, res) => {
    try {
        const { id } = req.params;
        const bomData = await pcbService.getMappedBom(id);
        res.status(200).json(bomData);
    } catch (error) {
        console.error("Mevcut BOM alınırken hata:", error);
        res.status(500).json({ message: "Mevcut BOM alınırken bir hata oluştu." });
    }
});

// BOM eşleştirmelerini günceller (YENİ EKLEME)
router.put('/update-bom-mapping', async (req, res) => {
    try {
        const { pcbId, updates } = req.body;
        if (!pcbId || !updates || !Array.isArray(updates)) {
            return res.status(400).json({ message: 'Geçersiz veri: pcbId ve güncellemeler eksik.' });
        }
        await pcbService.updateBomMapping(pcbId, updates);
        res.status(200).json({ message: 'BOM eşleştirmesi başarıyla güncellendi.' });
    } catch (error) {
        console.error('BOM eşleştirme güncelleme hatası:', error);
        res.status(500).json({ message: 'BOM eşleştirmesi güncellenirken bir hata oluştu.' });
    }
});


module.exports = router; // router'ı dışa aktarmayı unutma