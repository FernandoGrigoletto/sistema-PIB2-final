import { Button, Col, Container, Row, Modal, Form, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import EventoForm from "../components/EventoForm";
import eventoService from "../services/eventoService";
import EventoList from "../components/EventoList";
import EventoFiltro from "../components/EventoFiltro";

const Eventos = () => {
  const [showForm, setShowForm] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [eventoToDelete, setEventoToDelete] = useState(null);
  const [eventoToEdit, setEventoToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadEvento = async () => {
    try {
      const dados = await eventoService.getAll();
      setEventos(dados);
      setFilteredEventos(dados);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  useEffect(() => {
    loadEvento();
  }, []);

  // Filtro de busca simples pelo texto
  useEffect(() => {
    const results = eventos.filter(evento => 
      evento.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEventos(results);
  }, [searchTerm, eventos]);

  const handleSaveEvento = async (evento) => {
    try {
      if (evento.id > 0) {
        await eventoService.update(evento);
      } else {
        await eventoService.add(evento);
      }
      await loadEvento();
      setShowForm(false);
      setEventoToEdit(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleConfirmDelete = (id) => {
    setEventoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleEditEvento = (evento) => {
    setEventoToEdit(evento);
    setShowForm(true);
  };

  const handleDeleteEvento = async () => {
    await eventoService.remove(eventoToDelete);
    await loadEvento();
    setShowDeleteModal(false);
    setEventoToDelete(null);
  };

  return (
    <Container className="py-4">
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Agenda de Eventos</h2>
          <span className="text-muted">Gerencie as atividades da igreja</span>
        </div>
        <Button 
          variant="success" 
          onClick={() => { setEventoToEdit(null); setShowForm(!showForm); }}
          className="d-flex align-items-center gap-2"
        >
          {showForm ? "Cancelar" : <><FaPlus /> Novo Evento</>}
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <EventoForm
              evento={eventoToEdit}
              onSave={handleSaveEvento}
              onCancel={() => setShowForm(false)}
            />
          </Col>
        </Row>
      )}

      {/* Barra de Ferramentas (Busca e Filtros) */}
      <Row className="mb-4 g-3 align-items-center">
        <Col md={8}>
           <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Buscar evento por nome ou categoria..." 
              className="border-start-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
           </InputGroup>
        </Col>
        <Col md={4} className="text-end">
           {/* Aqui você pode manter o componente EventoFiltro se quiser filtros avançados, 
               ou simplificar apenas com a busca acima */}
           {/* <EventoFiltro onFiltersChange={setEventos} /> */}
        </Col>
      </Row>

      {/* Lista de Eventos (Grid) */}
      <Row>
        <EventoList 
          eventos={filteredEventos}
          onDelete={handleConfirmDelete}
          onEdit={handleEditEvento}
        />        
      </Row>

      {/* Modal de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este evento?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteEvento}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Eventos;
