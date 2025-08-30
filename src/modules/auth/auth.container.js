const createAuthService = require('./auth.service');
const authRepository = require('./auth.repository');

const authService = createAuthService(authRepository);

module.exports = authService;
