
const Oracao =require('../models/oracoes.js');
const oracaoRepository = require('../repository/oracaoRepository.js');
class OracoesController{
    async getAll(req,res){
        try {
            const {status,contato} = req.query;
            let oracao;

            
                oracao = await oracaoRepository.findAll();
            

            res.json({
                success: true,
                data: oracao.map(eq=> eq.toJSON()),
                total: oracao.length
            })
        } catch (error){
            res.status(500).json({success: false, message: error.message})

        }
    }
    async create(req, res){
        try {
            const oracao = new Oracao(req.body);
            const errors = oracao.validate();
            if(errors.length>0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                })
            }
            const newOracao = await oracaoRepository.create(oracao);
            res.status(201).json({
                success: true,
                data: newOracao.toJSON(),
                message: 'Oração criado com sucesso'
            })
        }catch (error){
            res.status(500).json({
                success: false,
                message: error.message

            });

        }
    }
    async getById(req, res){
        try{
            const {id} = req.params;
            const oracao = await oracaoRepository.findById(id);
            if(!oracao){
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }
            res.json({
                success: true,
                data: oracao.toJSON()
            });

        }catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
    async update(req, res){
        try{
            const {id} = req.params;
            const oracaoExistente = await oracaoRepository.findById(id);
            if(!oracaoExistente){
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }
            const oracao = new Oracao({...req.body,id})
            const errors = oracao.validate()
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                });
            }
            const oracaoAtualizado = await oracaoRepository.update(id,oracao)
            return res.json({
                success: true,
                data:oracaoAtualizado.toJSON(),
                message: 'Oracao atualizado com sucesso'
            })

        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
    async delete(req, res){
        try {
            const {id} =req.params;
            const oracao = await oracaoRepository.findById(id);
            if(!oracao){
                return res.status(404).json({
                    success: false,
                    message: 'Oracão não encontrado'
                });
                
            }
            const deleted = await oracaoRepository.delete(id);
            if(deleted){
                res.json({
                    success: true,
                    message: 'Oração deletado com sucesso'
                });                

            }else{
                res.status(500).json({
                    success: false,
                    message: `Erro ao deletar Evento: ${error.message}`
                });

            }

        }catch (error){
            res.status(500).json({
                    success: false,
                    message: error.message
                });

        }

    }
    


}
module.exports = new OracoesController ();