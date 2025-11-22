const FluxoCaixa = require("../models/FluxoCaixa.js");
const Categoria = require("../models/Categoria.js");

// Listar todos os registros
const getAllFluxos = async (req, res) => {
  try {
    const fluxos = await FluxoCaixa.findAll({
      include: {
        model: Categoria,
        as: "categoria",
        attributes: ["nome"],
      },
      order: [["data", "DESC"]],
    });

    // Transformar categoria para string simples
    const resultado = fluxos.map(f => ({
      id: f.id,
      descricao: f.descricao,
      valor: f.valor,
      tipo: f.tipo,
      data: f.data,
      categoria: f.categoria ? f.categoria.nome : null,
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar registros" });
  }
};

// Adicionar novo registro
const addFluxo = async (req, res) => {
  const { descricao, valor, tipo, data, categoria } = req.body;

  try {
    // Verifica se a categoria existe, senão cria
    let [cat, created] = await Categoria.findOrCreate({
      where: { nome: categoria },
      defaults: { nome: categoria },
    });

    // Cria o fluxo
    const fluxo = await FluxoCaixa.create({
      descricao,
      valor,
      tipo,
      data,
      categoria_id: cat.id,
    });

    res.status(201).json({
      id: fluxo.id,
      descricao: fluxo.descricao,
      valor: fluxo.valor,
      tipo: fluxo.tipo,
      data: fluxo.data,
      categoria: cat.nome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar registro" });
  }
};

// Atualizar registro
const updateFluxo = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, data, categoria } = req.body;

  try {
    let [cat, created] = await Categoria.findOrCreate({
      where: { nome: categoria },
      defaults: { nome: categoria },
    });

    const fluxo = await FluxoCaixa.findByPk(id);
    if (!fluxo) return res.status(404).json({ message: "Registro não encontrado" });

    await fluxo.update({
      descricao,
      valor,
      tipo,
      data,
      categoria_id: cat.id,
    });

    res.json({
      id: fluxo.id,
      descricao: fluxo.descricao,
      valor: fluxo.valor,
      tipo: fluxo.tipo,
      data: fluxo.data,
      categoria: cat.nome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar registro" });
  }
};

// Excluir registro
const deleteFluxo = async (req, res) => {
  const { id } = req.params;

  try {
    const fluxo = await FluxoCaixa.findByPk(id);
    if (!fluxo) return res.status(404).json({ message: "Registro não encontrado" });

    await fluxo.destroy();
    res.json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir registro" });
  }
};

module.exports = {
  getAllFluxos,
  addFluxo,
  updateFluxo,
  deleteFluxo,
};
