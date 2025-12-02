import { Button, Col, Container, Row, Modal, Form, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth"; // <--- 1. Importar useAuth

import EventoForm from "../components/EventoForm";
import eventoService from "../services/eventoService";
import EventoList from "../components/EventoList";

const Eventos = () => {
  const { user } = useAuth(); // <--- 2. Obter usuário logado
  
  // 3. Verificar permissão
  const isAdmin = user && (user.role === 'admin' || user.role === 'operador');

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

  useEffect(() => {
    const results = eventos.filter(evento => 
      (evento.titulo && evento.titulo.toLowerCase().includes(searchTerm.toLowerCase())) || 
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
    try {
        await eventoService.remove(eventoToDelete);
        await loadEvento();
        setShowDeleteModal(false);
        setEventoToDelete(null);
    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
  };

  return (
    <Container className="py-4">
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Agenda de Eventos</h2>
          <span className="text-muted">Gerencie as atividades da igreja</span>
        </div>
        
        {/* 4. Só mostra o botão de Novo Evento se for Admin */}
        {isAdmin && (
          <Button 
            variant="success" 
            onClick={() => { setEventoToEdit(null); setShowForm(!showForm); }}
            className="d-flex align-items-center gap-2"
          >
            {showForm ? "Cancelar" : <><FaPlus /> Novo Evento</>}
          </Button>
        )}
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

      {/* Barra de Ferramentas (Busca) */}
      <Row className="mb-4 g-3 align-items-center">
        <Col md={8}>
           <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Buscar evento por título, descrição ou categoria..." 
              className="border-start-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
           </InputGroup>
        </Col>
      </Row>

      {/* Lista de Eventos (Grid) */}
      <Row>
        <EventoList 
          eventos={filteredEventos}
          // 5. Só passa a função se for admin, caso contrário passa null
          onDelete={isAdmin ? handleConfirmDelete : null}
          onEdit={isAdmin ? handleEditEvento : null}
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
