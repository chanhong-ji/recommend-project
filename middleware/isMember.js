import { checkIsMember } from '../data/teams.js';

export const isMember = async (req, res, next) => {
    const { id } = req.params;

    if (isNaN(id)) return res.status(404).json({ detail: 'Not found' });

    checkIsMember(+id, req.userId).then((check) => {
        if (!check)
            return res.status(403).json({ detail: 'Permission denied' });
        req.teamId = +id;
        next();
    });
};
