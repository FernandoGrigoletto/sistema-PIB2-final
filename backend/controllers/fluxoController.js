const fluxoRepository = require("../repository/fluxoRepository.js");

// Listar todos os registros
const getAllFluxos = async (req, res) => {
  try {
    const fluxos = await fluxoRepository.findAll();
    // O método toJSON() da classe modelo já formata corretamente
    res.json(fluxos.map(f => f.toJSON()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar registros" });
  }
};

// Adicionar novo registro
const addFluxo = async (req, res) => {
  try {
    // O repositório já lida com a lógica de buscar/criar categoria
    const novoFluxo = await fluxoRepository.create(req.body);
    res.status(201).json(novoFluxo.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar registro" });
  }
};

// Atualizar registro
const updateFluxo = async (req, res) => {
  const { id } = req.params;
  try {
    const fluxoExistente = await fluxoRepository.findById(id);
    if (!fluxoExistente) {
      return res.status(404).json({ message: "Registro não encontrado" });
    }

    const fluxoAtualizado = await fluxoRepository.update(id, req.body);
    res.json(fluxoAtualizado.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar registro" });
  }
};

// Excluir registro
const deleteFluxo = async (req, res) => {
  const { id } = req.params;
  try {
    const fluxoExistente = await fluxoRepository.findById(id);
    if (!fluxoExistente) {
      return res.status(404).json({ message: "Registro não encontrado" });
    }

    await fluxoRepository.delete(id);
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
