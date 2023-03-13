class ProjectController {
    constructor(database) {
        this.database = database;
    }

    // retrieve project info
    retrieve = async (req, res) => {
        const project = await this.database.getById(req.projectId);

        return res.status(200).json(project);
    };

    // update project info
    update = async (req, res) => {
        const data = req.body; // {title, goal}

        const result = await this.database.updateById(req.projectId, data); // () => {id, title, goal}

        return res.status(200).json(result);
    };
}

export default ProjectController;
