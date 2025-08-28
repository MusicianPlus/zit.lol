const db = require('../../config/database');
const format = require('pg-format');

const findByManufacturerPartNumber = async (mpn) => {
    const sql = 'SELECT * FROM inventory.components WHERE manufacturer_part_number = $1';
    const { rows } = await db.query(sql, [mpn]);
    return rows[0];
};

// Dinamik olarak CREATE sorgusu oluşturur
const create = async (componentData) => {
    const fields = Object.keys(componentData);
    const values = Object.values(componentData);
    
    // SQL sorgusunu dinamik olarak oluştur
    const sql = format('INSERT INTO inventory.components (%I) VALUES (%L) RETURNING *', fields, values);
    
    const { rows } = await db.query(sql);
    return rows[0];
};

// Dinamik olarak UPDATE sorgusu oluşturur
const update = async (componentId, componentData) => {
    const fields = Object.keys(componentData);
    const values = Object.values(componentData);
    
    // Güncellenecek alanları 'key = value' formatına dönüştür
    const setQuery = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const sql = `UPDATE inventory.components SET ${setQuery} WHERE component_id = $1 RETURNING *`;
    const valuesWithId = [componentId, ...values];

    const { rows } = await db.query(sql, valuesWithId);
    return rows[0];
};

const getColumns = async () => {
    const sql = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'inventory' AND table_name = 'components' AND column_name <> 'component_id'
    `;
    const { rows } = await db.query(sql);
    return rows.map(row => row.column_name);
};

const getAllComponents = async () => {
    const sql = `SELECT * FROM inventory.components ORDER BY manufacturer_part_number`;
    const { rows } = await db.query(sql);
    return rows;
};

module.exports = {
    findByManufacturerPartNumber,
    create,
    getColumns,
    update,
    getAllComponents
};