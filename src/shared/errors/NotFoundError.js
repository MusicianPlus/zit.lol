const ApiError = require('./ApiError');

class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

module.exports = NotFoundError;
