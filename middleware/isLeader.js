import { checkIsLeader as checkIsLeaderOfTeam } from './../data/teams.js';
import { checkIsLeader as checkIsLeaderOfProject } from '../data/projects.js';

export const isLeader = async (req, res, next) => {
    const {
        params: { id },
        baseUrl,
    } = req;

    if (baseUrl === '/teams') {
        checkIsLeaderOfTeam(+id, req.userId).then((check) => {
            if (!check)
                return res.status(403).json({ detail: 'Permission denied' });
            req.teamId = +id;
            next();
        });
    } else if (baseUrl === '/projects') {
        checkIsLeaderOfProject(+id, req.userId).then((check) => {
            if (!check)
                return res.status(403).json({ detail: 'Permission denied' });
            req.projectId = +id;
            next();
        });
    }
};
