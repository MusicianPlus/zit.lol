// pcb.service.js dosyanızın GÜNCEL HALİ
const pcbRepository = require('./pcb.repository');
const componentService = require('../component-management/component.service');
const stockService = require('../stock-management/stock.service');

// PCB ve BOM verilerini işler
const processPcbAndBom = async (pcbName, bomData) => {
    // 1. Yeni bir PCB kaydı oluştur
    const pcb = await pcbRepository.createPcb(pcbName);

    const results = {
        pcbId: pcb.pcb_id,
        componentsAdded: 0,
    };

    // 2. BOM'daki her bir bileşeni işle
    for (const item of bomData) {
        try {
            // Sadece tanımlı olan değerleri içeren bir nesne oluşturalım
            const componentData = {};
            if (item.manufacturer_part_number) {
                componentData.manufacturer_part_number = item.manufacturer_part_number;
            }
            componentData.component_name = item.component_name || 'undefined';

            // İlgili bileşeni bul veya oluştur
            const component = await componentService.findOrCreateComponent(componentData, componentData);

            // Adet bilgisini designator alanından hesapla
            const designators = item.designator.split(',').map(d => d.trim());
            const quantity = designators.length;

            // PCB'ye bileşeni ekle
            await pcbRepository.addComponentToPcb(
                pcb.pcb_id,
                component.component_id,
                item.designator,
                quantity // Yeni satır: Adet bilgisini de gönderiyoruz
            );
            results.componentsAdded++;
        } catch (error) {
            console.error(`Bileşen işleme sırasında hata: ${error.message}`, item);
        }
    }
    return results;
};

const createPcb = async (pcbName) => {
    return await pcbRepository.createPcb(pcbName);
};

const getAllPcbs = async () => {
    return await pcbRepository.getAllPcbs();
};

const saveMappedBom = async (pcbId, bomData) => {
    // Önce PCB'nin mevcut BOM verilerini temizleyelim
    await pcbRepository.clearPcbComponents(pcbId);
    
    // Yalnızca eşleştirilmiş bileşenleri filtrele
    const mappedItems = bomData.filter(item => item.component_id);

    // Her bir eşleştirilmiş bileşeni kaydet
    for (const item of mappedItems) {
        // Designator alanı boşsa veya tanımsızsa quantity'yi 0 olarak ayarla
        const designators = item.designator ? item.designator.split(',').map(d => d.trim()) : [];
        const quantity = designators.length;
        
        await pcbRepository.addComponentToPcb(
            pcbId,
            item.component_id,
            item.designator,
            quantity
        );
    }
};

// Yeni BOM verisini kaydeder, eski veriyi siler
const savePcbBom = async (pcbId, bomData) => {
    await pcbRepository.clearPcbComponents(pcbId);

    for (const item of bomData) {
        const designatorsString = item.designators ? item.designators.join(', ') : null;
        await pcbRepository.savePcbComponent(
            pcbId,
            item.component_id,
            item.quantity,
            designatorsString,
            item.manufacturer_part_number
        );
    }
};

const getMappedBom = async (pcbId) => {
    return await pcbRepository.getPcbBomData(pcbId);
};

// BOM eşleştirmelerini günceller (YENİ EKLEME)
const updateBomMapping = async (pcbId, updates) => {
    return await pcbRepository.updateBomMapping(pcbId, updates);
};

// Tüm fonksiyonları dışa aktar
module.exports = {
    processPcbAndBom,
    createPcb,
    getAllPcbs,
    saveMappedBom,
    savePcbBom,
    getMappedBom,
    updateBomMapping,
};