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

    async create(eventoData) {
        const { description, category, brand } = eventoData;
        const [result] = await db.execute(
            'INSERT INTO eventos (description, category, brand) VALUES (?, ?, ?)',
            [description, category, brand]
        );
        return await this.findById(result.insertId);
    }

    async update(id, eventoData) {
        const { description, category, brand } = eventoData;
        await db.execute(
            'UPDATE eventos SET description = ?, category = ?, brand = ? WHERE id = ?',
            [description, category, brand, id]
        );
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM eventos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
export default new EventoRepository();