import userRepository from '../repository/userRepository.js';
import bcrypt from 'bcryptjs';

class UserController {
    async getAll(req, res) {
        try {
            const users = await userRepository.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }

    async create(req, res) {
        try {
            const { nome, email, password, role } = req.body;

            // Verifica se usuário já existe
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'E-mail já cadastrado.' });
            }

            // Criptografa a senha
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = await userRepository.create({ 
                nome, 
                email, 
                password: hashedPassword, 
                role 
            });

            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, role, password } = req.body;

            await userRepository.update(id, { nome, email, role });

            // Se o usuário enviou uma nova senha, atualizamos ela também
            if (password && password.trim() !== '') {
                const hashedPassword = await bcrypt.hash(password, 10);
                await userRepository.updatePassword(id, hashedPassword);
            }

            res.json({ success: true, message: 'Usuário atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            // Impede que o usuário delete a si mesmo (opcional, mas recomendado)
            if (req.user && req.user.id == id) {
                 return res.status(400).json({ error: 'Você não pode excluir seu próprio usuário.' });
            }

            await userRepository.delete(id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
    }
}

export default new UserController();