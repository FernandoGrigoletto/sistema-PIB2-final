import { useEffect, useState } from "react";
import { Button, Container, Modal, Card, Row, Col } from "react-bootstrap";
import MembroForm from "../components/MembroForm";
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
    <Container className="py-4">
      {/* Aplicação da estética de Card/Shadow igual ao RegisterPage */}
      <Card className="shadow border-0">
        <Card.Body className="p-4">
          {/* Cabeçalho alinhado */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary m-0">Cadastro de Membros</h2>
            <Button
              variant={showForm ? "secondary" : "success"}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancelar" : "Adicionar Membro"}
            </Button>
          </div>

          {showForm && (
            <div className="mb-4 p-3 bg-light bg-opacity-25 rounded border">
              <MembroForm
                membro={membroToEdit}
                onSave={handleSaveMembro}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <MembroFiltro onFiltersChange={setMembros} />

          <div className="mt-3">
            <MembroList
              membros={membros}
              onDelete={handleConfirmDelete}
              onEdit={handleEditMembro}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Modal de Exclusão */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este membro?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteMembro}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Membros;
