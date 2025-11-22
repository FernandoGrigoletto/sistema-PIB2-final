const eventoRepository = require('../repository/eventoRepository.js');
const Evento =require('../models/eventos.js')
class EventosController{
    async getAll(req,res){
        try {
            const {category,description} = req.query;
            let eventos;

            const filtros={}
            if (category) filtros.category=category;
            if (description) filtros.description=description;
            

            
            eventos = await eventoRepository.findAll(filtros);
            

            res.json({
                success: true,
                data: eventos.map(eq=> eq.toJSON()),
                total: eventos.length
            })
        } catch (error){
            res.status(500).json({success: false, message: error.message})

        }
    }
    async create(req, res){
        try {
            const evento = new Evento(req.body);
            const errors = evento.validate();
            if(errors.length>0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                })
            }
            const newEvent = await eventoRepository.create(evento);
            res.status(201).json({
                success: true,
                data: newEvent.toJSON(),
                message: 'Evento criado com sucesso'
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
            const evento = await eventoRepository.findById(id);
            if(!evento){
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }
            res.json({
                success: true,
                data: evento.toJSON()
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
            const eventoExistente = await eventoRepository.findById(id);
            if(!eventoExistente){
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
            }
            const evento = new Evento({...req.body,id})
            const errors = evento.validate()
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                });
            }
            const eventoAtualizado = await eventoRepository.update(id,evento)
            return res.json({
                success: true,
                data:eventoAtualizado.toJSON(),
                message: 'Evento atualizado com sucesso'
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
            const evento = await eventoRepository.findById(id);
            if(!evento){
                return res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
                
            }
            const deleted = await eventoRepository.delete(id);
            if(deleted){
                res.json({
                    success: true,
                    message: 'Evento deletado com sucesso'
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
module.exports = new EventosController ();