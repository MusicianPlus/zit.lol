const Joi = require('joi');

const addStockSchema = Joi.object({
    component_id: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
});

const setStockQuantitySchema = Joi.object({
    new_quantity: Joi.number().integer().min(0).required(),
});

const deleteStockSchema = Joi.object({
    component_id: Joi.string().required(),
});

module.exports = {
    addStockSchema,
    setStockQuantitySchema,
    deleteStockSchema,
};
