import jwt from 'jsonwebtoken';
import * as database from '../data/users.js';
import { config } from './../config.js';

const AUTHENTICATION_ERROR = 'Authentication error';

export const auth = async (req, res, next) => {
    const {
        headers: { authorization },
    } = req;

    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.status(401).json({ detail: AUTHENTICATION_ERROR });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, config.jwt.secret, async (error, decoded) => {
        if (error) {
            console.error(error);
            return res.status(401).json({ detail: AUTHENTICATION_ERROR });
        }

        const user = await database.findById(decoded.id);
        if (!user)
            return res.status(401).json({ detail: AUTHENTICATION_ERROR });

        req.userId = user.id;
        req.token = token;
        next();
    });
};
