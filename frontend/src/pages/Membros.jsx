mport { Button, Col, Container, Modal, Row } from "react-bootstrap";
import MembroForm from "../components/MembroForm";
import { useEffect, useState } from "react";
import MembroList from "../components/MembroList";
import membroService from "../services/membroService";
import MembroFiltro from "../components/MembroFiltro";

const Membros = () => {
  const [showForm, setShowForm] = useState(false);

  const [membros, setMembros] = useState([]);

  const [membroToDelete, setMembroToDelete] = useState(null);

  const [membroToEdit, setMembroToEdit] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadMembro = async () => {
    // obter do Service

    const dados = await membroService.getAll();

    setMembros(dados);
  };

  useEffect(() => {
    loadMembro();
  }, []);

  const handleSaveMembro = async (membro) => {
    if (membro.id > 0) {
      await membroService.update(membro);
      await loadMembro();
    } else {
      const saved = await membroService.add(membro);
      setMembros([...membros, saved]);
    }

    setShowForm(false);
  };

  const handleConfirmDelete = (id) => {
    setMembroToDelete(id);
    setShowDeleteModal(true);
  };

  const handleEditMembro = (membro) => {
    setMembroToEdit(membro);
    setShowForm(true);
  };

  const handleDeleteMembro = async () => {
    await membroService.remove(membroToDelete);
    await loadMembro();
    setShowDeleteModal(false);
    setMembroToDelete(null);
  };

  return (
    <>
      <Container className="py-4">
        <Row className="mb-4">
          <Col className="d-flex justify-content-between alig-items-center">
            <h1 className="title">Cadastro de Membros</h1>
            <Button variant="success" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancelar" : "Adicionar Membro"}
            </Button>
          </Col>
        </Row>

        {showForm && (
          <Row className="mb-4">
            <Col>
              <MembroForm
                membro={membroToEdit}
                onSave={handleSaveMembro}
                onCancel={() => setShowForm(false)}
              ></MembroForm>
            </Col>
          </Row>
        )}

        <MembroFiltro onFiltersChange={setMembros}></MembroFiltro>

        <MembroList
          membros={membros}
          onDelete={handleConfirmDelete}
          onEdit={handleEditMembro}
        ></MembroList>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Tem certeza que deseja excluir este membro?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteMembro}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Membros;