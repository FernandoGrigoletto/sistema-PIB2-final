const membroRepository = require("../repository/membroRepository");

const Membro = require("../models/membros");

class MembrosController {
  async getAll(req, resp) {
    try {
      const { status, cidade, genero, nome } = req.query;
      // localhost:3000/membros?status=Ativo&genero=Masculino
      let membros;

      const filtros = {};

      if (status) filtros.status = status;
      if (genero) filtros.genero = genero;
      if (cidade) filtros.cidade = cidade;
      if (nome) filtros.nome = nome;

      membros = await membroRepository.findAll(filtros);

      resp.json({
        success: true,
        data: membros.map((mem) => mem.toJSON()),
        total: membros.length,
      });
    } catch (error) {
      resp.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, resp) {
    try {
      const membro = new Membro(req.body);
      const errors = membro.validate();

      if (errors.length > 0) {
        return resp.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors,
        });
      }

      const newMembro = await membroRepository.create(membro);

      resp.status(201).json({
        success: true,
        data: newMembro.toJSON(),
        message: "Membro criado com sucesso!",
      });
    } catch (error) {
      resp.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req, resp) {
    try {
      const { id } = req.params;

      const membro = await membroRepository.findById(id);

      if (!membro) {
        return resp.status(404).json({
          success: false,
          message: "Membro não encontrado!",
        });
      }

      resp.json({
        success: true,
        data: membro.toJSON(),
      });
    } catch (error) {
      resp.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, resp) {
    try {
      const { id } = req.params;
      const membroExistente = await membroRepository.findById(id);

      if (!membroExistente) {
        return resp.status(404).json({
          success: false,
          message: "Membro não encontrado!",
        });
      }

      const membro = new Membro({ ...req.body, id });
      const errors = membro.validate();

      if (errors.length > 0) {
        return resp.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors,
        });
      }

      const membroAtualizado = await membroRepository.update(id, membro);

      return resp.json({
        success: true,
        data: membroAtualizado.toJSON(),
        message: "Membro atualizado com sucesso!",
      });
    } catch (error) {
      resp.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStatus(req, resp) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["Ativo", "Inativo", "Ausente", "Visitante"];

      if (!validStatuses.includes(status)) {
        return resp.status(400).json({
          success: false,
          message: "Status inválido!",
        });
      }

      const membro = await membroRepository.findById(id);

      if (!membro) {
        return resp.status(404).json({
          success: false,
          message: "Membro não encontrado!",
        });
      }

      const updatedMembro = await membroRepository.updateStatus(id, status);

      return resp.json({
        success: true,
        data: updatedMembro.toJSON(),
        message: "Status atualizado com sucesso!",
      });
    } catch (error) {
      resp.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, resp) {
    try {
      const { id } = req.params;

      const membro = await membroRepository.findById(id);

      if (!membro) {
        return resp.status(404).json({
          success: false,
          message: "Membro não encontrado!",
        });
      }

      const deleted = await membroRepository.delete(id);

      if (deleted) {
        resp.json({
          success: true,
          message: "Membro deletado com sucesso!",
        });
      } else {
        resp.status(500).json({
          success: false,
          message: "Erro ao deletar membro!",
        });
      }
    } catch (error) {
      resp.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkCpf(req, res) {
    try {
      const { cpf, id } = req.query;

      if (!cpf) return res.status(400).json({ error: "CPF é obrigatório" });

      const [rows] = await db.execute(
        "SELECT id FROM membros WHERE cpf = ?" + (id ? " AND id != ?" : ""),
        id ? [cpf, id] : [cpf]
      );

      const exists = rows.length > 0;
      return res.json({ exists });
    } catch (err) {
      res.status(500).json({ error: "Erro ao verificar CPF" });
    }
  }
}

module.exports = new MembrosController();
