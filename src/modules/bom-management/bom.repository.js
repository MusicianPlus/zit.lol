const db = require('../../config/database');

// Yeni bir PCB oluşturur ve döndürür
async function createPcb(pcb_name, description) {
    const sql = 'INSERT INTO inventory.pcbs (pcb_name, description) VALUES ($1, $2) RETURNING *';
    const values = [pcb_name, description];
    const { rows } = await db.query(sql, values);
    return rows[0];
}

// Bir BOM'a bileşen ekler
async function addBomItem(pcb_id, component_id, quantity, designator) {
    const sql = `
        INSERT INTO inventory.bill_of_materials
        (pcb_id, component_id, quantity, designator)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [pcb_id, component_id, quantity, designator];
    const { rows } = await db.query(sql, values);
    return rows[0];
}

// Bir PCB'nin tüm BOM bileşenlerini döndürür
async function getBomForPcb(pcb_id) {
    const sql = `
        SELECT
            b.pcb_id,
            b.component_id,
            b.quantity,
            b.designator,
            c.component_name,
            c.manufacturer_part_number
        FROM inventory.bill_of_materials b
        JOIN inventory.components c ON b.component_id = c.component_id
        WHERE b.pcb_id = $1
    `;
    const { rows } = await db.query(sql, [pcb_id]);
    return rows;
}

// Bir BOM bileşenini siler
async function removeBomItem(bom_id) {
    const sql = 'DELETE FROM inventory.bill_of_materials WHERE bom_id = $1 RETURNING *';
    const { rows } = await db.query(sql, [bom_id]);
    return rows[0];
}

module.exports = {
    createPcb,
    addBomItem,
    getBomForPcb,
    removeBomItem
};