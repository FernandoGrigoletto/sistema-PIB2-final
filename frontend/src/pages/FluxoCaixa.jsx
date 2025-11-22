import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import FluxoList from "../components/FluxoList";
import FluxoForm from "../components/FluxoForm";
import FluxoFiltro from "../components/FluxoFiltro";
import fluxoService from "../services/fluxoService";

const FluxoCaixa = () => {
  const [showForm, setShowForm] = useState(false);
  const [fluxos, setFluxos] = useState([]);
  const [filteredFluxos, setFilteredFluxos] = useState([]);
  const [categorias, setCategorias] = useState([
    "Dízimo",
    "Doação",
    "Venda",
    "Despesa",
  ]);
  const [fluxoToDelete, setFluxoToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Carrega os registros
  const loadFluxos = async () => {
    const dados = await fluxoService.getAll();
    setFluxos(dados);
    setFilteredFluxos(dados);
  };

  useEffect(() => {
    loadFluxos();
  }, []);

  // Salvar registro
  const handleSaveFluxo = async (fluxo) => {
    if (!categorias.includes(fluxo.categoria)) {
      setCategorias([...categorias, fluxo.categoria]);
    }

    if (fluxo.id > 0) {
      await fluxoService.update(fluxo);
      await loadFluxos();
    } else {
      const saved = await fluxoService.add(fluxo);
      setFluxos([...fluxos, saved]);
      setFilteredFluxos([...filteredFluxos, saved]);
    }

    setShowForm(false);
  };

  // Confirma exclusão
  const handleConfirmDelete = (id) => {
    setFluxoToDelete(id);
    setShowDeleteModal(true);
  };

  // Executa exclusão
  const handleDeleteFluxo = async () => {
    const updatedFluxos = await fluxoService.remove(fluxoToDelete);
    setFluxos(updatedFluxos);
    setFilteredFluxos(updatedFluxos);
    setShowDeleteModal(false);
    setFluxoToDelete(null);
  };

  // Filtrar registros
  const handleFilter = ({ tipo, categoria, dataInicio, dataFim }) => {
    let dados = [...fluxos];

    if (tipo !== "todos") dados = dados.filter((f) => f.tipo === tipo);
    if (categoria !== "todos") dados = dados.filter((f) => f.categoria === categoria);
    if (dataInicio) dados = dados.filter((f) => f.data >= dataInicio);
    if (dataFim) dados = dados.filter((f) => f.data <= dataFim);

    setFilteredFluxos(dados);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Fluxo de Caixa</h1>
          <Button variant="success" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Adicionar Registro"}
          </Button>
        </Col>
      </Row>

      {/* Formulário de registro */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <FluxoForm onSave={handleSaveFluxo} fluxo={null} />
          </Col>
        </Row>
      )}

      {/* Filtro */}
      <Row className="mb-3">
        <Col>
          <FluxoFiltro categorias={categorias} onFilter={handleFilter} />
        </Col>
      </Row>

      {/* Lista de registros */}
      <Row>
        <FluxoList fluxos={filteredFluxos} onDelete={handleConfirmDelete} />
      </Row>

      {/* Modal de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este registro?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteFluxo}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FluxoCaixa;

