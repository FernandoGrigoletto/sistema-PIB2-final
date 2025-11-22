const db = require('../config/database.js');
const Evento = require('../models/eventos.js');

class EventoRepository{
    async findAll(filter={}){

        try {
            let query='select*from eventos';
            const condicoes=[];
            const params=[];            

            if(filter.category){
                condicoes.push('category = ?');
                params.push(filter.category)
            }
            if(filter.description){
                condicoes.push('description = ?');
                params.push(filter.description)
            }
            
            if(condicoes.length>0){
                query += ' WHERE ' + condicoes.join(' AND ')
            }
            const [rows] = await db.execute(query,params)

            return rows.map(row => new Evento(row))

        }catch(error){
            throw new Error('Erro ao buscar evento')
        }        
    }

    async findById(id){
        
        try {
            const [rows] = await db.execute('SELECT * FROM eventos WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Evento(rows[0]);

        }catch (error){
            throw new Error(`Erro ao buscar evento: ${error.message}`);

        }
    }
    

    async create (eventoData){
        try {
            const {description, category, brand} = eventoData;
            const [result] = await db.execute('INSERT INTO eventos (description, category, brand) VALUES(?,?,?)',
                [description, category, brand]
            )
            return await this.findById(result.insertId)
        }catch (error){
            throw new Error(`Erro ao criar evento: ${error.message}`)
        }
    }

    async update(id,eventoData){
        try{
            const {description, category, brand} = eventoData;
            await db.execute('UPDATE eventos SET description = ?, category = ?, brand = ? WHERE id = ?',
                [description, category, brand, id]
            );
            return await this.findById(id);
        }catch (error){
            throw new Error(`Erro ao atualizar evento: ${error.message}`);

        }
    }

    async delete(id){
        try {
            const [result] = await db.execute('DELETE FROM eventos WHERE id = ?',[id]);
            return result.affectedRows >0;
            
        }catch(error){
            throw new Error(`Erro ao deletar evento: ${error.message}`);

        }
    }

}
module.exports = new EventoRepository();