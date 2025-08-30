const { ValidationError } = require('../errors');

const validator = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        throw new ValidationError(error.details[0].message);
    }
    next();
};

module.exports = validator;
