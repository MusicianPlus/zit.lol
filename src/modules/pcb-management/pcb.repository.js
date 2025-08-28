// pcb.repository.js
const db = require('../../config/database');

// Yeni bir PCB kaydı oluşturur
const createPcb = async (pcbName) => {
const sql = `
INSERT INTO inventory.pcbs (pcb_name)
VALUES ($1)
RETURNING *
`;
const { rows } = await db.query(sql, [pcbName]);
return rows[0];
};

// Bir PCB'ye bileşen ekler (yenisiyle değiştirildi)
const savePcbComponent = async (pcbId, componentId, quantity, designator, mpn) => {
    const sql = `
        INSERT INTO inventory.components_in_pcb (pcb_id, component_id, quantity, designator, manufacturer_part_number)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [pcbId, componentId, quantity, designator, mpn];

    const { rows } = await db.query(sql, values);
    return rows[0];
};

// Tüm PCB'leri döndürür
const getAllPcbs = async () => {
const sql = `SELECT * FROM inventory.pcbs ORDER BY pcb_name`;
const { rows } = await db.query(sql);
return rows;
};

// Bir PCB'nin tüm bileşen kayıtlarını siler
const clearPcbComponents = async (pcbId) => {
const sql = `DELETE FROM inventory.components_in_pcb WHERE pcb_id = $1`;
await db.query(sql, [pcbId]);
};

const getPcbBomData = async (pcbId) => {
    const sql = `
        SELECT
            c_in_pcb.id AS component_in_pcb_id,
            c_in_pcb.component_id,
            c_in_pcb.manufacturer_part_number AS bom_mpn,
            c_in_pcb.quantity,
            c_in_pcb.designator,
            comp.component_name,
            comp.manufacturer_part_number AS component_mpn
        FROM
            inventory.components_in_pcb c_in_pcb
        LEFT JOIN
            inventory.components comp ON c_in_pcb.component_id = comp.component_id
        WHERE
            c_in_pcb.pcb_id = $1
    `;
    const { rows } = await db.query(sql, [pcbId]);
    return rows;
};

const updateBomMapping = async (pcbId, updates) => {
    const client = await db.query('BEGIN'); // db.getClient() yerine db.query('BEGIN') kullanıldı
    try {
        for (const update of updates) {
            const sql = `
                UPDATE inventory.components_in_pcb
                SET component_id = $1
                WHERE id = $2 AND pcb_id = $3
            `;
            await db.query(sql, [update.component_id, update.component_in_pcb_id, pcbId]);
        }
        await db.query('COMMIT');
    } catch (e) {
        await db.query('ROLLBACK');
        throw e;
    }
    // db.getClient() kullanıldığı durumda client.release() burada olurdu,
    // ancak db.query('BEGIN') kullandığımız için buna gerek yok.
};

module.exports = { 
    createPcb,
    savePcbComponent, // Yeni fonksiyonu export et
    clearPcbComponents,
    getPcbBomData,
    updateBomMapping,
    getAllPcbs
};