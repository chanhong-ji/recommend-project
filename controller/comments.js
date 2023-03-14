class CommentController {
    constructor(database) {
        this.database = database;
    }

    createLike = async (req, res) => {
        const { id } = req.params;

        const result = await this.database.createLike(id, req.userId);

        if (result == 0)
            return res.status(400).json({ detail: 'already done' });
        return res.sendStatus(201);
    };
}

export default CommentController;
