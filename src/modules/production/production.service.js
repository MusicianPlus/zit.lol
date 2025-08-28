const productionRepository = require('./production.repository');
const stockService = require('../stock-management/stock.service');

// Yeni bir üretim partisi başlatır ve gerekli bileşenleri stoktan düşer
exports.startProductionBatch = async (pcb_id, quantity_produced) => {
    // 1. Yeni üretim partisini oluştur
    const newBatch = await productionRepository.createProductionBatch(pcb_id, quantity_produced);

    // 2. PCB'nin BOM (Parça Listesi) bilgilerini getir
    const bomItems = await productionRepository.getBomForPcb(pcb_id);

    // 3. BOM'daki her bir bileşeni stoktan düş
    for (const item of bomItems) {
        const totalQuantityToDeduct = item.quantity * quantity_produced; // 'item.quantity_required' yerine 'item.quantity' kullanıldı
        // stockService'den reduceStock fonksiyonunu çağır
        await stockService.reduceStock(item.component_id, totalQuantityToDeduct);
    }
    
    // 4. Üretim tamamlandı olarak işaretle (örneği basitleştirmek için)
    await productionRepository.completeProductionBatch(newBatch.batch_id);

    return newBatch;
};

exports.generateProductionPlan = async (pcb_id) => {
    // 1. PCB'nin BOM ve stok bilgilerini repository'den getir
    const bomAndStock = await productionRepository.getBomAndStockForPcb(pcb_id);

    // 2. Her bir bileşen için gerekli miktar, mevcut stok ve eksik miktarı hesapla
    const plan = bomAndStock.map(item => {
        const shortfall = item.required_quantity - item.quantity_on_hand;
        const isSufficient = shortfall <= 0;

        return {
            component_id: item.component_id,
            component_name: item.component_name,
            manufacturer_part_number: item.manufacturer_part_number,
            required_quantity: item.required_quantity,
            quantity_on_hand: item.quantity_on_hand,
            is_sufficient: isSufficient,
            shortfall: shortfall > 0 ? shortfall : 0
        };
    });

    return plan;
};

exports.generateDetailedProductionPlan = async (pcb_id) => {
    // Repository'den gelen veriyi al
    const bomAndStock = await productionRepository.getFullBomAndStockForPcb(pcb_id);

    const plan = bomAndStock.map(item => {
        const isMatched = !!item.component_id;
        const required = item.required_quantity;
        const available = item.quantity_on_hand;
        const shortfall = isMatched ? Math.max(0, required - available) : required;

        return {
            component_id: item.component_id,
            designator: item.designator,
            // Eşleşmemişse BOM'dan gelen MPN bilgisini kullan
            component_name: isMatched ? item.component_name : `Bilinmiyor: ${item.bom_mpn}`, 
            // manufacturer_part_number alanını her zaman BOM'dan gelen değerle doldur
            manufacturer_part_number: item.bom_mpn,
            required_quantity: required,
            quantity_on_hand: isMatched ? available : 'N/A',
            status: isMatched ? (required <= available ? 'Yeterli' : 'Yetersiz') : 'Eşleştirilmemiş',
            shortfall: shortfall,
        };
    });

    return plan;
};

module.exports = {
    startProductionBatch: exports.startProductionBatch,
    generateProductionPlan: exports.generateProductionPlan,
    generateDetailedProductionPlan: exports.generateDetailedProductionPlan

};