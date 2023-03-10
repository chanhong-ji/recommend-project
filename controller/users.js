import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class UserController {
    constructor(database) {
        this.database = database;
    }

    signup = async (req, res) => {
        const { username, email, password } = req.body;
        const user = await this.database.findByEmail(email);
        if (user)
            return res.status(400).json({ detail: 'Email already taken' });

        const hashed = await this.hash(password);
        const userId = await this.database.createUser({
            username,
            email,
            password: hashed,
        });
        return res.status(201).json({ userId });
    };

    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.database.findByEmail(email);
        if (!user) {
            return res.status(404).json({ detail: 'Not found with the email' });
        }

        const passwordConfirm = await bcrypt.compare(password, user.password);
        if (!passwordConfirm) {
            return res.status(401).json({ detail: 'Password wrong' });
        }

        const token = this.createJwtToken(user.id);
        return res.status(200).json({ token });
    };

    me = async (req, res) => {
        const user = await this.database.findById(req.userId);
        if (!user) return res.status(404).json({ detail: 'User not found' });

        delete user.password;

        return res.status(200).json(user);
    };

    hash = async (password) => {
        return bcrypt.hash(password, config.bcrypt.salt);
    };

    update = async (req, res) => {
        const data = req.body;

        //when user try to edit email
        if (data.email) {
            const user = this.database.findByEmail(data.email);
            if (user)
                return res.status(400).json({ detail: 'Email already taken' });
        }
        // return 1, if something has changed
        const changed = await this.database.updateById(req.userId, data);

        if (changed == 'error') return res.sendStatus(500);
        return res.sendStatus(200);
    };

    profile = async (req, res) => {
        const {
            params: { userId },
        } = req;

        const user = await this.database.findById(userId);
        if (!user) return res.status(404).json({ detail: 'User not found' });
        delete user.password;

        return res.status(200).json(user);
    };

    createJwtToken = (id) => {
        return jwt.sign({ id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresInSec,
        });
    };
}

export default UserController;
