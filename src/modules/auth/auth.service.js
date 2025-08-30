const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../../shared/errors');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

const createAuthService = (authRepository) => {
    const authenticateUser = async (username, password, rememberMe) => {
        const user = await authRepository.findUserByUsername(username);

        if (!user) {
            throw new UnauthorizedError('Kullanıcı adı veya şifre yanlış.');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new UnauthorizedError('Kullanıcı adı veya şifre yanlış.');
        }

        const expiresIn = rememberMe ? '30d' : '1h';

        const tokenPayload = { id: user.id, username: user.username };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

        return token;
    };

    return {
        authenticateUser,
    };
};

module.exports = createAuthService;