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
    db: {
        database: required('DB_NAME'),
        username: required('DB_USERNAME'),
        password: required('DB_PASSWORD'),
        host: required('DB_HOST'),
        dialect: required('DB_DIALECT'),
    },
};
