import { checkIsMember as checkIsMemberOfTeam } from '../data/teams.js';
import { checkIsMember as checkIsMemberOfProject } from './../data/projects.js';

export const isMember = async (req, res, next) => {
    const {
        params: { id },
        baseUrl,
    } = req;

    if (baseUrl === '/teams') {
        checkIsMemberOfTeam(+id, req.userId).then((check) => {
            if (!check)
                return res.status(403).json({ detail: 'Permission denied' });
            req.teamId = +id;
            next();
        });
    } else if (baseUrl === '/projects') {
        checkIsMemberOfProject(+id, req.userId).then((check) => {
            if (!check)
                return res.status(403).json({ detail: 'Permission denied' });
            req.projectId = +id;
            next();
        });
    }
};
