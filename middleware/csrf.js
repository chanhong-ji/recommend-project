import bcrypt from 'bcrypt';
import { config } from './../config.js';

const AUTHENTICATION_ERROR = 'CSRF Authentication fail';

export const csrfCheck = (req, res, next) => {
    if (
        req.method === 'GET' ||
        req.method === 'HEAD' ||
        req.method === 'OPTIONS'
    ) {
        return next();
    }

    const csrfHeader = req.get('csrf-token');

    if (!csrfHeader)
        return res.status(403).json({ detail: AUTHENTICATION_ERROR });

    return validateCSRFToken(csrfHeader)
        .then((valid) => {
            if (!valid)
                return res.status(403).json({ detail: AUTHENTICATION_ERROR });
            next();
        })
        .catch((error) => {
            // console.error(error)
            return res.status(500).json({ detail: AUTHENTICATION_ERROR });
        });
};

async function validateCSRFToken(csrfToken) {
    return bcrypt.compare(config.csrf.plainToken, csrfToken);
}
