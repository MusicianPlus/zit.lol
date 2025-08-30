const db = require('../../config/database');

async function componentExists(component_id) {
  const exists = await db('components').where({ component_id }).first();
  return !!exists;
}

async function findAll() {
  const stockItems = await db('stock')
    .join('components', 'stock.component_id', '=', 'components.component_id')
    .select(
      'stock.component_id',
      'stock.quantity_on_hand',
      'components.component_name',
      'components.description',
      'components.manufacturer',
      'components.manufacturer_part_number'
    )
    .orderBy('components.component_name', 'asc');
  return stockItems;
}

async function createOrUpdate(component_id, quantity) {
  const newStock = await db('stock')
    .insert({ component_id, quantity_on_hand: quantity })
    .onConflict('component_id')
    .merge({ quantity_on_hand: db.raw('stock.quantity_on_hand + ?', [quantity]) })
    .returning('*');
  return newStock[0];
}

async function updateQuantity(component_id, new_quantity) {
  const updatedStock = await db('stock')
    .where({ component_id })
    .update({ quantity_on_hand: new_quantity })
    .returning('*');
  return updatedStock[0];
}

async function remove(component_id) {
  const deletedStock = await db('stock')
    .where({ component_id })
    .del()
    .returning('*');
  return deletedStock[0];
}

async function findById(component_id) {
  const stockItem = await db('stock')
    .join('components', 'stock.component_id', '=', 'components.component_id')
    .select(
      'stock.component_id',
      'stock.quantity_on_hand',
      'components.component_name',
      'components.description'
    )
    .where('stock.component_id', component_id)
    .first();
  return stockItem;
}

module.exports = {
  findAll,
  createOrUpdate,
  updateQuantity,
  remove,
  findById,
  componentExists,
};