import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import EventoForm from "../components/EventoForm";
import eventoService from "../services/eventoService";
import EventoList from "../components/EventoList";
import EventoFiltro from "../components/EventoFiltro";


const Eventos = () => {
  const [showForm, setShowForm] = useState(false);

  const [eventos, setEventos] = useState([]);
  const [eventoToDelete, setEventoToDelete] = useState(null);
  const [eventoToEdit, setEventoToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadEvento = async () => {
    const dados = await eventoService.getAll();

    setEventos(dados);
  };

  useEffect(() => {
    loadEvento();
  }, []);

  const handleSaveEvento =async (evento) => {

    if(evento.id>0){
      await eventoService.update(evento)
      await loadEvento()

    }else{
      const saved =await eventoService.add(evento);
      setEventos([...eventos, saved]);

    }
    

    setShowForm(false);
  };

  const handleConfirmDelete = (id) => {
    setEventoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleEditEvento = (evento) => {
    setEventoToEdit(evento)
    setShowForm(true)
    
  };

  const handleDeleteEvento =async() => {
    await eventoService.remove(eventoToDelete);
    await loadEvento();
    setShowDeleteModal(false);
    setEventoToDelete(null);
  };

  

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Gerenciamento de Eventos</h1>
          <Button variant="success" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Adicionar Evento"}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <EventoForm
              evento={eventoToEdit}
              onSave={handleSaveEvento}
              onCancel={() => setShowForm(false)}
            ></EventoForm>
          </Col>
        </Row>
      )}

      

      <Row>
        <EventoFiltro onFiltersChange={setEventos}></EventoFiltro>
        <EventoList eventos={eventos}
          onDelete={handleConfirmDelete}
          onEdit={handleEditEvento}></EventoList>        
      </Row>
      <Row>
        
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
