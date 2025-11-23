import db from '../config/database.js';
import Evento from '../models/eventos.js';

class EventoRepository {
    async findAll(filter = {}) {
        let query = 'SELECT * FROM eventos';
        const params = [];
        const conditions = [];

        if (filter.category) {
            conditions.push('category = ?');
            params.push(filter.category);
        }
        if (filter.description) {
            conditions.push('description LIKE ?');
            params.push(`%${filter.description}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await db.execute(query, params);
        return rows.map(row => new Evento(row));
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM eventos WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new Evento(rows[0]);
    }

    // ATUALIZADO: Incluindo titulo e arquivo
    async create(eventoData) {
        const { titulo, description, category, brand, arquivo } = eventoData;
        const [result] = await db.execute(
            'INSERT INTO eventos (titulo, description, category, brand, arquivo) VALUES (?, ?, ?, ?, ?)',
            [titulo, description, category, brand, arquivo]
        );
        return await this.findById(result.insertId);
    }

    // ATUALIZADO: Incluindo titulo e arquivo (opcional)
    async update(id, eventoData) {
        const { titulo, description, category, brand, arquivo } = eventoData;
        
        let query = 'UPDATE eventos SET titulo = ?, description = ?, category = ?, brand = ?';
        let params = [titulo, description, category, brand];

        // Só atualiza o arquivo se um novo foi enviado
        if (arquivo) {
            query += ', arquivo = ?';
            params.push(arquivo);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM eventos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
export default new EventoRepository();