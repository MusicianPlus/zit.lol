const bomRepository = require('./bom.repository');
const db = require('../../config/database');

// Yeni bir PCB oluşturur ve BOM'unu yönetmeye başlar
exports.createPcbAndBom = async (pcb_name, description, components) => {
    // 1. PCB'yi oluştur
    const newPcb = await bomRepository.createPcb(pcb_name, description);
    
    // 2. Her bir bileşeni BOM'a ekle
    const bomItems = [];
    if (components && components.length > 0) {
        for (const item of components) {
            // Bileşenin components tablosunda var olup olmadığını kontrol et
            const componentCheck = await db.query('SELECT component_id FROM inventory.components WHERE component_id = $1', [item.component_id]);
            if (componentCheck.rows.length === 0) {
                throw new Error(`Component with ID ${item.component_id} not found.`);
            }

            const bomItem = await bomRepository.addBomItem(
                newPcb.pcb_id,
                item.component_id,
                item.quantity,
                item.designator
            );
            bomItems.push(bomItem);
        }
    }
    
    return {
        pcb: newPcb,
        bomItems: bomItems
    };
};

// Bir PCB'nin BOM'unu getirir
exports.getBomDetails = async (pcb_id) => {
    const bomItems = await bomRepository.getBomForPcb(pcb_id);
    return bomItems;
};

// Bir BOM bileşenini siler
exports.deleteBomItem = async (bom_id) => {
    const deletedItem = await bomRepository.removeBomItem(bom_id);
    if (!deletedItem) {
        throw new Error('BOM item not found.');
    }
    return deletedItem;
};