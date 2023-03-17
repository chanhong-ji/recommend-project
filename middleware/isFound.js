import { findById as findIdeaById } from '../data/ideas.js';
import { findById as findCommentById } from '../data/comments.js';

export const isFound = async (req, res, next) => {
    const baseUrl = req.baseUrl;
    const { id } = req.params;
    if (baseUrl === '/ideas') {
        const exist = await findIdeaById(id);
        if (!exist) {
            return res.status(400).json({ detail: 'Idea not found' });
        }
        next();
    } else if (baseUrl === '/comments') {
        const exist = await findCommentById(id);
        if (!exist) {
            return res.status(400).json({ detail: 'Comment not found' });
        }
        next();
    }
};
