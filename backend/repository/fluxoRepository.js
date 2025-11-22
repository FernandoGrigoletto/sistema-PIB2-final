const db = require('../config/database.js');
const FluxoCaixa = require('../models/FluxoCaixa.js');

class FluxoRepository {
    
    // Auxiliar para lidar com a lógica de "Buscar ou Criar Categoria"
    async _getOrCreateCategoriaId(nomeCategoria) {
        // 1. Tenta achar a categoria
        const [rows] = await db.execute('SELECT id FROM categorias WHERE nome = ?', [nomeCategoria]);
        
        if (rows.length > 0) {
            return rows[0].id;
        }

        // 2. Se não achar, cria
        const [result] = await db.execute('INSERT INTO categorias (nome) VALUES (?)', [nomeCategoria]);
        return result.insertId;
    }

    async findAll() {
        try {
            // Faz o JOIN para trazer o nome da categoria junto
            const query = `
                SELECT f.*, c.nome as categoria 
                FROM fluxo_caixa f 
                LEFT JOIN categorias c ON f.categoria_id = c.id 
                ORDER BY f.data DESC
            `;
            const [rows] = await db.execute(query);
            return rows.map(row => new FluxoCaixa(row));
        } catch (error) {
            throw new Error(`Erro ao buscar fluxos: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const query = `
                SELECT f.*, c.nome as categoria 
                FROM fluxo_caixa f 
                LEFT JOIN categorias c ON f.categoria_id = c.id 
                WHERE f.id = ?
            `;
            const [rows] = await db.execute(query, [id]);
            if (rows.length === 0) return null;
            return new FluxoCaixa(rows[0]);
        } catch (error) {
            throw new Error(`Erro ao buscar fluxo por ID: ${error.message}`);
        }
    }

    async create(fluxoData) {
        try {
            const { descricao, valor, tipo, data, categoria } = fluxoData;
            
            // Resolve o ID da categoria (busca ou cria)
            const categoriaId = await this._getOrCreateCategoriaId(categoria);

            const query = `
                INSERT INTO fluxo_caixa (descricao, valor, tipo, data, categoria_id) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.execute(query, [descricao, valor, tipo, data, categoriaId]);
            
            // Retorna o objeto criado
            return await this.findById(result.insertId);
        } catch (error) {
            throw new Error(`Erro ao criar fluxo: ${error.message}`);
        }
    }

    async update(id, fluxoData) {
        try {
            const { descricao, valor, tipo, data, categoria } = fluxoData;
            
            // Resolve o ID da categoria
            const categoriaId = await this._getOrCreateCategoriaId(categoria);

            const query = `
                UPDATE fluxo_caixa 
                SET descricao = ?, valor = ?, tipo = ?, data = ?, categoria_id = ? 
                WHERE id = ?
            `;

            await db.execute(query, [descricao, valor, tipo, data, categoriaId, id]);
            
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Erro ao atualizar fluxo: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM fluxo_caixa WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Erro ao deletar fluxo: ${error.message}`);
        }
    }
}

module.exports = new FluxoRepository();