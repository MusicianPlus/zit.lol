const ApiError = require('./ApiError');

class ValidationError extends ApiError {
    constructor(message = 'Invalid Input') {
        super(message, 400);
    }
}

module.exports = ValidationError;
