const { NotFoundError, ValidationError } = require('../../shared/errors');

const createStockService = (stockRepository) => {
    const getAllStock = async () => {
        return await stockRepository.findAll();
    };

    const addStock = async (component_id, quantity) => {
        if (!await stockRepository.componentExists(component_id)) {
            throw new NotFoundError('Belirtilen component_id components tablosunda bulunamadı.');
        }

        if (quantity <= 0) {
            throw new ValidationError('Eklenen miktar pozitif bir değer olmalıdır.');
        }

        return await stockRepository.createOrUpdate(component_id, quantity);
    };

    const setStockQuantity = async (component_id, new_quantity) => {
        const existingStock = await stockRepository.findById(component_id);
        if (!existingStock) {
            throw new NotFoundError('Stokta bu bileşene ait kayıt bulunamadı.');
        }
        if (new_quantity < 0) {
            throw new ValidationError('Stok miktarı negatif olamaz.');
        }
        return await stockRepository.updateQuantity(component_id, new_quantity);
    };

    const deleteStock = async (component_id) => {
        const existingStock = await stockRepository.findById(component_id);
        if (!existingStock) {
            throw new NotFoundError('Stokta bu bileşene ait kayıt bulunamadı.');
        }
        return await stockRepository.remove(component_id);
    };

    return {
        getAllStock,
        addStock,
        setStockQuantity,
        deleteStock
    };
};

module.exports = createStockService;