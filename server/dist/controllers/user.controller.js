import { User } from '../models/user.model.js';
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, { attributes: ['id', 'username'] });
        return res.json(user);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al obtener perfil', error: err });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;
        const user = await User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        user.username = username || user.username;
        await user.save();
        return res.json({ message: 'Perfil actualizado', user });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al actualizar perfil', error: err });
    }
};
