const stockRepository = require('./stock.repository');
const db = require('../../config/database'); 

// Tüm stok kalemlerini getirme
const getAllStock = async () => {
    return await stockRepository.findAll();
};

// Yeni bir bileşen stoğu oluşturma veya mevcut stoğu artırma
const addStock = async (component_id, quantity) => {
    // İlk olarak, component_id'nin components tablosunda var olup olmadığını kontrol edelim
    const componentCheck = await db.query('SELECT component_id FROM components WHERE component_id = $1', [component_id]);
    if (componentCheck.rows.length === 0) {
        throw new Error('Belirtilen component_id components tablosunda bulunamadı.');
    }

    // Miktarın pozitif olduğunu kontrol et
    if (quantity <= 0) {
        throw new Error('Eklenen miktar pozitif bir değer olmalıdır.');
    }

    return await stockRepository.createOrUpdate(component_id, quantity);
};

// Bir bileşenin stok miktarını ayarlama (doğrudan miktar ataması)
const setStockQuantity = async (component_id, new_quantity) => {
    const existingStock = await stockRepository.findById(component_id);
    if (!existingStock) {
        throw new Error('Stokta bu bileşene ait kayıt bulunamadı.');
    }
    if (new_quantity < 0) {
        throw new Error('Stok miktarı negatif olamaz.');
    }
    return await stockRepository.updateQuantity(component_id, new_quantity);
};

// Bir bileşeni stoktan silme
const deleteStock = async (component_id) => {
    const existingStock = await stockRepository.findById(component_id);
    if (!existingStock) {
        throw new Error('Stokta bu bileşene ait kayıt bulunamadı.');
    }
    return await stockRepository.remove(component_id);
};

// Fonksiyonları dışa aktarma
module.exports = {
    getAllStock,
    addStock,
    setStockQuantity,
    deleteStock
};