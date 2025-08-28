const procurementRepository = require('./procurement.repository');
const stockService = require('../stock-management/stock.service');
const componentService = require('../component-management/component.service');
const db = require('../../config/database');

exports.processAndSaveOrder = async (data, mapping, supplierName) => {
    const order = await procurementRepository.createOrder(supplierName);
    const results = {
        stockUpdated: 0,
        orderItemsAdded: 0,
        orderId: order.order_id
    };

    for (const row of data) {
        const manufacturer_part_number = row[mapping.manufacturer_part_number];
        const quantity = parseInt(row[mapping.quantity], 10);

        if (!manufacturer_part_number || isNaN(quantity)) {
            continue;
        }

        try {
            // Sadece components tablosuna ait verileri içeren bir nesne oluştur.
            // quantity alanını bu nesneden dışarıda bırakıyoruz.
            const componentData = {};
            for (const key in mapping) {
                if (key !== 'quantity' && mapping[key] && row[mapping[key]]) {
                    componentData[key] = row[mapping[key]];
                }
            }
            
            // Bileşeni oluştur veya güncelle (sadece component verileriyle)
            const component = await componentService.findOrCreateComponent(componentData, componentData);
            
            // Stoğu güncelle
            await stockService.addStock(component.component_id, quantity);
            results.stockUpdated++;

            // Sipariş öğesini kaydet
            await procurementRepository.createOrderItem(order.order_id, component.component_id, manufacturer_part_number, quantity);
            results.orderItemsAdded++;
            
        } catch (error) {
            console.error(`Sipariş işleme sırasında hata: ${error.message}`, row);
        }
    }
    return results;
};