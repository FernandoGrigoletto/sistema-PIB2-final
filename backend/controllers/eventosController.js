import eventoRepository from '../repository/eventoRepository.js';
import Evento from '../models/eventos.js';

class EventosController {
    async getAll(req, res) {
        try {
            const eventos = await eventoRepository.findAll(req.query);
            res.json({ success: true, data: eventos.map(e => e.toJSON()) });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const evento = new Evento(req.body);
            const errors = evento.validate();
            if (errors.length > 0) return res.status(400).json({ success: false, errors });

            const newEvent = await eventoRepository.create(evento);
            res.status(201).json({ success: true, data: newEvent.toJSON() });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const evento = await eventoRepository.findById(req.params.id);
            if (!evento) return res.status(404).json({ success: false, message: 'Evento não encontrado' });
            res.json({ success: true, data: evento.toJSON() });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const exists = await eventoRepository.findById(id);
            if (!exists) return res.status(404).json({ success: false, message: 'Evento não encontrado' });

            const evento = new Evento({ ...req.body, id });
            const updated = await eventoRepository.update(id, evento);
            res.json({ success: true, data: updated.toJSON() });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await eventoRepository.delete(req.params.id);
            if (deleted) res.json({ success: true, message: 'Deletado com sucesso' });
            else res.status(404).json({ success: false, message: 'Não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
export default new EventosController();