import db from '../config/database.js';
import FluxoCaixa from '../models/FluxoCaixa.js';

class FluxoRepository {
    
    async _getOrCreateCategoriaId(nomeCategoria) {
        const [rows] = await db.execute('SELECT id FROM categorias WHERE nome = ?', [nomeCategoria]);
        if (rows.length > 0) return rows[0].id;
        const [result] = await db.execute('INSERT INTO categorias (nome) VALUES (?)', [nomeCategoria]);
        return result.insertId;
    }

    async findAll() {
        const query = `
            SELECT f.*, c.nome as categoria 
            FROM fluxo_caixa f 
            LEFT JOIN categorias c ON f.categoria_id = c.id 
            ORDER BY f.data DESC
        `;
        const [rows] = await db.execute(query);
        return rows.map(row => new FluxoCaixa(row));
    }

    async findById(id) {
        const query = `
            SELECT f.*, c.nome as categoria 
            FROM fluxo_caixa f 
            LEFT JOIN categorias c ON f.categoria_id = c.id 
            WHERE f.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length === 0) return null;
        return new FluxoCaixa(rows[0]);
    }

    async create(fluxoData) {
        const { descricao, valor, tipo, data, categoria } = fluxoData;
        const categoriaId = await this._getOrCreateCategoriaId(categoria);
        const query = `INSERT INTO fluxo_caixa (descricao, valor, tipo, data, categoria_id) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [descricao, valor, tipo, data, categoriaId]);
        return await this.findById(result.insertId);
    }

    async update(id, fluxoData) {
        const { descricao, valor, tipo, data, categoria } = fluxoData;
        const categoriaId = await this._getOrCreateCategoriaId(categoria);
        const query = `
            UPDATE fluxo_caixa 
            SET descricao = ?, valor = ?, tipo = ?, data = ?, categoria_id = ? 
            WHERE id = ?
        `;
        await db.execute(query, [descricao, valor, tipo, data, categoriaId, id]);
        return await this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM fluxo_caixa WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
export default new FluxoRepository();