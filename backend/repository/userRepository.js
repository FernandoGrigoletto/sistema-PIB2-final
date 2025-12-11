import db from '../config/database.js';

class UserRepository {
    async findAll() {
        // Não retornamos a senha na listagem por segurança
        const [rows] = await db.execute('SELECT id, nome, email, role FROM users ORDER BY nome ASC');
        return rows;
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT id, nome, email, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    async create(user) {
        const { nome, email, password, role } = user;
        const [result] = await db.execute(
            'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
            [nome, email, password, role]
        );
        return { id: result.insertId, nome, email, role };
    }

    async update(id, user) {
        const { nome, email, role } = user;
        // Atualiza apenas dados cadastrais básicos (senha é tratada separadamente se necessário)
        await db.execute(
            'UPDATE users SET nome = ?, email = ?, role = ? WHERE id = ?',
            [nome, email, role, id]
        );
        return { id, nome, email, role };
    }

    async updatePassword(id, hashedPassword) {
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default new UserRepository();