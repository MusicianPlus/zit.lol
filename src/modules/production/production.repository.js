const db = require('../../config/database');

// Yeni bir üretim partisi kaydı oluşturur
async function createProductionBatch(pcb_id, quantity_produced) {
    const sql = `
        INSERT INTO inventory.production_batches (pcb_id, quantity_produced, status)
        VALUES ($1, $2, 'IN_PROGRESS')
        RETURNING *
    `;
    const values = [pcb_id, quantity_produced];
    const { rows } = await db.query(sql, values);
    return rows[0];
}

// Bir üretim partisini tamamlandı olarak işaretler
async function completeProductionBatch(batch_id) {
    const sql = `
        UPDATE inventory.production_batches
        SET completion_date = NOW(), status = 'COMPLETED'
        WHERE batch_id = $1
        RETURNING *
    `;
    const { rows } = await db.query(sql, [batch_id]);
    return rows[0];
}

// Bir PCB'nin BOM (Parça Listesi) detaylarını getirir
async function getBomForPcb(pcb_id) {
    const sql = `
        SELECT
            bom.component_id,
            bom.quantity -- Hatalı isim olan 'quantity_required' yerine 'quantity' kullanıldı
        FROM inventory.bill_of_materials bom
        WHERE bom.pcb_id = $1
    `;
    const { rows } = await db.query(sql, [pcb_id]);
    return rows;
}

async function getBomAndStockForPcb(pcb_id) {
    const sql = `
        SELECT
            cpc.component_id,
            cpc.quantity AS required_quantity, -- quantity sütununu required_quantity olarak adlandırdık
            c.component_name,
            c.manufacturer_part_number,
            COALESCE(s.quantity_on_hand, 0) AS quantity_on_hand
        FROM components_in_pcb cpc -- Tablo adı düzeltildi
        JOIN components c ON cpc.component_id = c.component_id
        LEFT JOIN stock s ON cpc.component_id = s.component_id
        WHERE cpc.pcb_id = $1
    `;
    const { rows } = await db.query(sql, [pcb_id]);
    return rows;
}

async function getFullBomAndStockForPcb(pcb_id) {
    const sql = `
        SELECT
            cic.quantity AS required_quantity,
            cic.designator,
            cic.component_id,
            cic.manufacturer_part_number AS bom_mpn, -- Bu satırı ekle
            c.component_name,
            c.manufacturer_part_number AS component_mpn,
            cs.quantity_on_hand
        FROM
            inventory.components_in_pcb cic
        LEFT JOIN
            inventory.components c ON cic.component_id = c.component_id
        LEFT JOIN
            inventory.stock cs ON cic.component_id = cs.component_id
        WHERE
            cic.pcb_id = $1
    `;
    const { rows } = await db.query(sql, [pcb_id]);
    return rows;
};

module.exports = {
    createProductionBatch,
    completeProductionBatch,
    getBomAndStockForPcb,
    getFullBomAndStockForPcb,
    getBomForPcb
};