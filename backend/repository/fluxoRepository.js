const FluxoCaixa = require("../models/FluxoCaixa.js");
const Categoria = require("../models/Categoria.js");

class FluxoRepository {
  // Listar todos os registros
  async getAll() {
    const fluxos = await FluxoCaixa.findAll({
      include: {
        model: Categoria,
        as: "categoria",
        attributes: ["nome"],
      },
      order: [["data", "DESC"]],
    });

    return fluxos.map(f => ({
      id: f.id,
      descricao: f.descricao,
      valor: f.valor,
      tipo: f.tipo,
      data: f.data,
      categoria: f.categoria ? f.categoria.nome : null,
    }));
  }

  // Criar ou obter categoria
  async getOrCreateCategoria(nome) {
    const [cat, created] = await Categoria.findOrCreate({
      where: { nome },
      defaults: { nome },
    });
    return cat;
  }

  // Adicionar registro
  async add(fluxoData) {
    const cat = await this.getOrCreateCategoria(fluxoData.categoria);

    const fluxo = await FluxoCaixa.create({
      descricao: fluxoData.descricao,
      valor: fluxoData.valor,
      tipo: fluxoData.tipo,
      data: fluxoData.data,
      categoria_id: cat.id,
    });

    return {
      id: fluxo.id,
      descricao: fluxo.descricao,
      valor: fluxo.valor,
      tipo: fluxo.tipo,
      data: fluxo.data,
      categoria: cat.nome,
    };
  }

  // Atualizar registro
  async update(id, fluxoData) {
    const fluxo = await FluxoCaixa.findByPk(id);
    if (!fluxo) throw new Error("Registro não encontrado");

    const cat = await this.getOrCreateCategoria(fluxoData.categoria);

    await fluxo.update({
      descricao: fluxoData.descricao,
      valor: fluxoData.valor,
      tipo: fluxoData.tipo,
      data: fluxoData.data,
      categoria_id: cat.id,
    });

    return {
      id: fluxo.id,
      descricao: fluxo.descricao,
      valor: fluxo.valor,
      tipo: fluxo.tipo,
      data: fluxo.data,
      categoria: cat.nome,
    };
  }

  // Excluir registro
  async remove(id) {
    const fluxo = await FluxoCaixa.findByPk(id);
    if (!fluxo) throw new Error("Registro não encontrado");

    await fluxo.destroy();
    return true;
  }
}

module.exports = new FluxoRepository();