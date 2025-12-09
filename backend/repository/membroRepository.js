const db = require("../config/database");

const Membro = require("../models/membros");

class MembroRepository {
  async findAll(filters = {}) {
    try {
      let query = "select * from membros";
      const condicoes = [];
      const params = [];

      if (filters.genero) {
        condicoes.push("genero = ?");
        params.push(filters.genero);
      }

      if (filters.status) {
        condicoes.push("status = ?");
        params.push(filters.status);
      }

      if (filters.cidade) {
        condicoes.push("LOWER(cidade) LIKE ?");
        params.push(`${filters.cidade.toLowerCase()}%`);
      }

      if (filters.nome) {
        condicoes.push("LOWER(nome) LIKE ?");
        params.push(`${filters.nome.toLowerCase()}%`);
      }

      if (condicoes.length > 0) {
        query += " where " + condicoes.join(" and ");
      }

      const [rows] = await db.execute(query, params);

      return rows.map((row) => new Membro(row));
    } catch (error) {
      throw new Error("Erro ao buscar membro");
    }
  }

  async findById(id) {
    try {
      const [rows] = await db.execute("SELECT * FROM membros WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) return null;

      return new Membro(rows[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar membro: ${error.message}`);
    }
  }

  async create(membroData) {
    try {
      const {
        nome,
        endereco,
        cidade,
        email,
        cpf,
        nasc,
        genero,
        telefone,
        status,
      } = membroData;

      const [existing] = await db.execute(
        "SELECT id FROM membros WHERE cpf = ?",
        [cpf]
      );
      if (existing.length > 0) {
        throw new Error("CPF já cadastrado.");
      }

      const [result] = await db.execute(
        "INSERT INTO membros (nome, endereco, cidade, email, cpf, nasc, genero, telefone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [nome, endereco, cidade, email, cpf, nasc, genero, telefone, status]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Erro ao criar membro: ${error.message}`);
    }
  }

  async update(id, membroData) {
    try {
      const {
        nome,
        endereco,
        cidade,
        email,
        cpf,
        nasc,
        genero,
        telefone,
        status,
      } = membroData;

      const [existing] = await db.execute(
        "SELECT id FROM membros WHERE cpf = ? AND id != ?",
        [cpf, id]
      );
      if (existing.length > 0) {
        throw new Error("CPF já cadastrado para outro membro.");
      }

      await db.execute(
        "UPDATE membros SET nome = ?, endereco = ?, cidade = ?, email = ?, cpf = ?, nasc = ?, genero = ?, telefone = ?, status = ? WHERE id = ?",
        [nome, endereco, cidade, email, cpf, nasc, genero, telefone, status, id]
      );

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar membro: ${error.message}`);
    }
  }

  async updateStatus(id, status) {
    try {
      await db.execute("UPDATE membros SET status = ? WHERE id = ?", [
        status,
        id,
      ]);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const [result] = await db.execute("DELETE FROM membros WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar membro: ${error.message}`);
    }
  }
}

module.exports = new MembroRepository();
