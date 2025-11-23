import fluxoRepository from "../repository/fluxoRepository.js";

export const getAllFluxos = async (req, res) => {
  try {
    const fluxos = await fluxoRepository.findAll();
    res.json(fluxos.map(f => f.toJSON()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar registros" });
  }
};

export const addFluxo = async (req, res) => {
  try {
    const novoFluxo = await fluxoRepository.create(req.body);
    res.status(201).json(novoFluxo.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar registro" });
  }
};

export const updateFluxo = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await fluxoRepository.findById(id);
    if (!exists) return res.status(404).json({ message: "Não encontrado" });

    const atualizado = await fluxoRepository.update(id, req.body);
    res.json(atualizado.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar" });
  }
};

export const deleteFluxo = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await fluxoRepository.findById(id);
    if (!exists) return res.status(404).json({ message: "Não encontrado" });

    await fluxoRepository.delete(id);
    res.json({ message: "Excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir" });
  }
};
