const db = require('../../config/database');

// Tüm stok kalemlerini, bileşen bilgilerini de dahil ederek listeler
async function findAll() {
  const sql = `
    SELECT
      s.component_id,
      s.quantity_on_hand,
      c.component_name,
      c.description,
      c.manufacturer,
      c.manufacturer_part_number
    FROM inventory.stock s
    JOIN inventory.components c ON s.component_id = c.component_id
    ORDER BY c.component_name ASC; -- Bu satırı ekledik
  `;
  const { rows } = await db.query(sql);
  return rows;
}

// Yeni bir bileşeni stoğa ekler veya mevcutsa miktarını günceller
async function createOrUpdate(component_id, quantity) {
  const sql = `
    INSERT INTO inventory.stock (component_id, quantity_on_hand)
    VALUES ($1, $2)
    ON CONFLICT (component_id)
    DO UPDATE SET quantity_on_hand = inventory.stock.quantity_on_hand + EXCLUDED.quantity_on_hand
    RETURNING *;
  `;
  const values = [component_id, quantity];
  const { rows } = await db.query(sql, values);
  return rows[0];
}

// Bir bileşenin stok miktarını günceller
async function updateQuantity(component_id, new_quantity) {
  const sql = 'UPDATE inventory.stock SET quantity_on_hand = $1 WHERE component_id = $2 RETURNING *';
  const values = [new_quantity, component_id];
  const { rows } = await db.query(sql, values);
  return rows[0];
}

// Bir bileşeni stoktan siler
async function remove(component_id) {
  const sql = 'DELETE FROM inventory.stock WHERE component_id = $1 RETURNING *';
  const { rows } = await db.query(sql, [component_id]);
  return rows[0];
}

// Bir bileşeni ID'sine göre bulur (JOIN ile detayları getirir)
async function findById(component_id) {
  const sql = `
    SELECT
      s.component_id,
      s.quantity_on_hand,
      c.component_name,
      c.description
    FROM inventory.stock s
    JOIN inventory.components c ON s.component_id = c.component_id
    WHERE s.component_id = $1;
  `;
  const { rows } = await db.query(sql, [component_id]);
  return rows[0];
}

module.exports = {
  findAll,
  createOrUpdate,
  updateQuantity,
  remove,
  findById,
};