import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

export const config = {
    port: parseInt(required('PORT', 8000)),
    cors: {
        allowedOrigin: required('CORS_ALLOW_ORIGIN', ''),
    },
    bcrypt: {
        salt: required('BC_SALT', 8),
    },
    jwt: {
        secret: required('JWT_SECRET'),
        expiresInSec: required('JWT_EXPIRES_IN_SEC', 60 * 60 * 24 * 3),
    },
};
