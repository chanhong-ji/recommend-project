import bcrypt from 'bcrypt';
import { config } from '../config.js';

class TeamController {
    constructor(database) {
        this.database = database;
    }

    //create a new team
    create = async (req, res) => {
        const { name, password } = req.body;
        const hashed = await this.hash(password);

        const team = await this.database.createTeam(name, hashed, req.userId); // () => code, name

        return res.status(201).json(team);
    };

    //list up all teams user participated in
    list = async (req, res) => {
        const teams = await this.database.findAllByUserId(req.userId);
        return res.status(200).json(teams);
    }; // () => team[]

    //get user into the team
    participate = async (req, res) => {
        const { code, password } = req.body;

        const team = await this.database.findByCode(code); // {code, password, id}
        if (!team) return res.status(404).json({ detail: 'Team not found' });

        const passwordConfirm = await bcrypt.compare(password, team.password);
        if (!passwordConfirm)
            return res.status(401).json({ detail: 'Password wrong' });

        await this.database.updateTeamWithMember(team.id, req.userId); // {teamId}

        return res.status(200).json({ teamId: team.id });
    };

    // get info about team
    retreive = async (req, res) => {
        const team = await this.database.findById(req.teamId); // () => {members, name}
        return res.status(200).json(team);
    };

    // add project of team
    add = async (req, res) => {
        const { title, goal } = req.body;

        const project = await this.database.createProject(
            title,
            goal,
            req.teamId
        ); // () => {id, title, goal}

        return res.status(201).json(project);
    };

    // list of projects which team has
    listOfProjects = async (req, res) => {
        const projects = await this.database.getProjectsById(req.teamId); //() => project[]

        return res.status(200).json(projects);
    };

    // static
    hash = async (password) => {
        return bcrypt.hash(password, config.bcrypt.salt);
    };
}

export default TeamController;
