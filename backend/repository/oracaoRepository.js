const db = require('../config/database.js');
const Oracao = require('../models/oracoes.js');

class OracaoRepository{
    async findAll(){

        try {
            const [rows] = await db.execute('SELECT * FROM oracao');
            return rows.map(rows => new Oracao(rows))
        } catch (error){
            throw new Error(`Erro ao buscar orações: ${error.message}`);

        }
    }

    async findById(id){
        
        try {
            const [rows] = await db.execute('SELECT * FROM oracao WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Oracao(rows[0]);

        }catch (error){
            throw new Error(`Erro ao buscar orações: ${error.message}`);

        }
    }
    

    async create (oracaoData){
        try {
            const {nome, contato, pedido, data} = oracaoData;
            const [result] = await db.execute('INSERT INTO oracao (nome, contato, pedido, data) VALUES(?,?,?,?)',
                [nome, contato, pedido, data]
            )
            return await this.findById(result.insertId)
        }catch (error){
            throw new Error(`Erro ao criar oracão: ${error.message}`)
        }
    }

    async update(id,oracaoData){
        try{
            const {nome, contato, pedido, data} = oracaoData;
            await db.execute('UPDATE oracao SET nome = ?, contato = ?, pedido = ?, data=? WHERE id = ?',
                [nome, contato, pedido, data, id]
            );
            return await this.findById(id);
        }catch (error){
            throw new Error(`Erro ao atualizar oração: ${error.message}`);

        }
    }

    async delete(id){
        try {
            const [result] = await db.execute('DELETE FROM oracao WHERE id = ?',[id]);
            return result.affectedRows >0;
            
        }catch(error){
            throw new Error(`Erro ao deletar oração: ${error.message}`);

        }
    }

}
module.exports = new OracaoRepository();