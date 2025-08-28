const db = require('../../config/database');

// Yeni bir sipariş kaydı oluşturur
const createOrder = async (supplierName) => {
    const sql = `
        INSERT INTO inventory.procurement_orders (supplier_name)
        VALUES ($1)
        RETURNING *
    `;
    const { rows } = await db.query(sql, [supplierName]);
    return rows[0];
};

// Bir siparişe ait parçaları kaydeder
const createOrderItem = async (orderId, componentId, manufacturerPartNumber, quantity) => {
    const sql = `
        INSERT INTO inventory.order_items (order_id, component_id, manufacturer_part_number, quantity)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [orderId, componentId, manufacturerPartNumber, quantity];
    const { rows } = await db.query(sql, values);
    return rows[0];
};

module.exports = {
    createOrder,
    createOrderItem
};