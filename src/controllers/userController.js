import User from '../models/User.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class UserController {
    async createAdmin(req, res) {
        try {
            const hashSenha = await bcrypt.hash(req.body.password, 10);

            const userToCreate = {
                id: crypto.randomUUID(),
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
                password: hashSenha,
                is_admin: true
            };

            const user = await User.create(userToCreate);
            user.password = undefined;

            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json({ error: 'Erro ao criar administrador', details: err.message });
        }
    }

    async createClient(req, res) {
        try {
            const hashSenha = await bcrypt.hash(req.body.password, 10);

            const userToCreate = {
                id: crypto.randomUUID(),
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
                password: hashSenha,
                is_admin: false
            };

            const user = await User.create(userToCreate);
            user.password = undefined;

            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json({ error: 'Erro ao criar cliente', details: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const senhaValida = await bcrypt.compare(password, user.password);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }

            const token = jwt.sign({ id: user.id }, 'sua_chave_secreta_aqui', {
                expiresIn: '1d'
            });

            user.password = undefined;

            return res.status(200).json({ user, token });
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao realizar login', details: err.message });
        }
    }

    async getAllUser(req, res) {
        try {
            const user = await User.findAll({ attributes: { exclude: ['password'] } });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao listar usuários', details: err.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const idLogado = req.userId;

            if (String(id) !== String(idLogado)) {
                const usuarioLogado = await User.findByPk(idLogado);

                if (!usuarioLogado || !usuarioLogado.is_admin) {
                    return res.status(403).json({
                        error: 'Acesso negado. Você só pode deletar a sua própria conta.'
                    });
                }
            }

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            await user.destroy();

            return res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao deletar usuário', details: err.message });
        }
    }
}

export default new UserController();