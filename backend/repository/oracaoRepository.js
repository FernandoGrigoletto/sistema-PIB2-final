import db from '../config/database.js';
import Oracao from '../models/oracoes.js';

class OracaoRepository {
    async findAll() {
        const [rows] = await db.execute('SELECT * FROM oracao ORDER BY data DESC');
        return rows.map(row => new Oracao(row));
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM oracao WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new Oracao(rows[0]);
    }

    async create(oracaoData) {
        const { nome, contato, pedido, data } = oracaoData;
        const [result] = await db.execute(
            'INSERT INTO oracao (nome, contato, pedido, data) VALUES (?, ?, ?, ?)',
            [nome, contato, pedido, data]
        );
        return await this.findById(result.insertId);
    }

    async update(id, oracaoData) {
        const { nome, contato, pedido, data } = oracaoData;
        await db.execute(
            'UPDATE oracao SET nome = ?, contato = ?, pedido = ?, data = ? WHERE id = ?',
            [nome, contato, pedido, data, id]
        );
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM oracao WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
export default new OracaoRepository();