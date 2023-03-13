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

    // create an idea toward project
    createIdea = async (req, res) => {
        const { text } = req.body;

        const idea = await this.database.createIdea(req.projectId, text);

        return res.status(201).json(idea);
    };

    // get ideas of project ordered by more like
    getIdeas = async (req, res) => {
        const { page } = req.query;

        const ideas = await this.database.getIdeas(
            req.projectId,
            isNaN(page) ? 1 : page
        );

        return res.status(200).json(ideas);
    };
}

export default ProjectController;
