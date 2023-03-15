import jwt from 'jsonwebtoken';
import * as database from '../data/users.js';
import { config } from './../config.js';

const AUTHENTICATION_ERROR = 'Authentication error';

export const auth = async (req, res, next) => {
    const {
        headers: { authorization },
    } = req;

    let token;

    // Token authorization
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    // If no token in header, check browser cookies
    if (!token) {
        token = req.cookies['token'];
    }

    if (!token) {
        return res.status(401).json({ detail: AUTHENTICATION_ERROR });
    }

    jwt.verify(token, config.jwt.secret, async (error, decoded) => {
        if (error) {
            // console.error(error);
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
