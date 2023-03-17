import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const result = validationResult(req);

    if (result.errors.length === 0) {
        return next();
    }

    return res.status(400).json({ detail: result.errors[0].msg });
};
