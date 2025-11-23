import oracaoRepository from '../repository/oracaoRepository.js';
import Oracao from '../models/oracoes.js';

class OracoesController {
    async getAll(req, res) {
        try {
            const oracoes = await oracaoRepository.findAll();
            res.json({
                success: true,
                data: oracoes.map(o => o.toJSON()),
                total: oracoes.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const oracao = new Oracao(req.body);
            const errors = oracao.validate();
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                });
            }
            const newOracao = await oracaoRepository.create(oracao);
            res.status(201).json({
                success: true,
                data: newOracao.toJSON(),
                message: 'Oração criada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const oracao = await oracaoRepository.findById(id);
            if (!oracao) {
                return res.status(404).json({
                    success: false,
                    message: 'Oração não encontrada'
                });
            }
            res.json({
                success: true,
                data: oracao.toJSON()
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const oracaoExistente = await oracaoRepository.findById(id);
            if (!oracaoExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Oração não encontrada'
                });
            }
            const oracao = new Oracao({ ...req.body, id });
            const errors = oracao.validate();
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                });
            }
            const oracaoAtualizado = await oracaoRepository.update(id, oracao);
            return res.json({
                success: true,
                data: oracaoAtualizado.toJSON(),
                message: 'Oração atualizada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const oracao = await oracaoRepository.findById(id);
            if (!oracao) {
                return res.status(404).json({
                    success: false,
                    message: 'Oração não encontrada'
                });
            }
            const deleted = await oracaoRepository.delete(id);
            if (deleted) {
                res.json({
                    success: true,
                    message: 'Oração deletada com sucesso'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao deletar oração'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

// Esta linha é fundamental para corrigir o erro de "does not provide an export named 'default'"
export default new OracoesController();