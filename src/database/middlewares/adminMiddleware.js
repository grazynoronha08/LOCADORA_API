import User from '../../models/User.js';

export default async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user || user.is_admin === false) {
            return res.status(403).json({ error: 'Acesso negado. Ação permitida apenas para administradores.' });
        }

        return next();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar permissões de acesso.' });
    }
};