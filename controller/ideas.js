class IdeaController {
    constructor(database) {
        this.database = database;
    }

    getComments = async (req, res) => {
        const { id } = req.params;
        const { page } = req.query;

        const comments = await this.database.getComments(
            id,
            isNaN(page) ? 1 : page
        );

        return res.status(200).json(comments);
    };

    createComment = async (req, res) => {
        const {
            body: { text },
            params: { id },
        } = req;

        const comment = await this.database.createComment(id, req.userId, text);

        return res.status(201).json(comment);
    };

    createLike = async (req, res) => {
        const { id } = req.params;

        const result = await this.database.createLike(id, req.userId);

        if (result == 0)
            return res.status(400).json({ detail: 'already done' });
        return res.sendStatus(201);
    };
}

export default IdeaController;
