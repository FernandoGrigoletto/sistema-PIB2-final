import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useState, useEffect } from "react"; // Removido filtro local
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

import MembroForm from "../components/MembroForm"; 
import membroService from "../services/membroService"; 
import MembroList from "../components/MembroList";
import MembroFiltro from "../components/MembroFiltro"; // <--- IMPORTAR

const Membros = () => {
  const { user } = useAuth();
  const canManage = user && (user.role === 'admin' || user.role === 'operador');

  const [showForm, setShowForm] = useState(false);
  const [membros, setMembros] = useState([]); // A lista exibida vem direto do filtro
  
  const [membroToDelete, setMembroToDelete] = useState(null);
  const [membroToEdit, setMembroToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // NOTA: O useEffect de loadMembros inicial foi removido pois o 
  // MembroFiltro já roda uma vez ao montar e carrega os dados iniciais.

  const handleSaveMembro = async (membro) => {
    try {
      if (membro.id) {
        await membroService.update(membro);
      } else {
        await membroService.add(membro);
      }
      // Recarrega dados (pode ser melhorado para recarregar com filtros atuais)
      const dados = await membroService.getAll(); 
      setMembros(dados);
      
      setShowForm(false);
      setMembroToEdit(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleDeleteMembro = async () => {
    try {
        await membroService.remove(membroToDelete);
        // Atualiza a lista visualmente removendo o item
        setMembros(prev => prev.filter(m => m.id !== membroToDelete));
        setShowDeleteModal(false);
        setMembroToDelete(null);
    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Gestão de Membros</h2>
          <span className="text-muted">Administre os membros da igreja</span>
        </div>
        
        {canManage && (
          <Button 
            variant="success" 
            onClick={() => { setMembroToEdit(null); setShowForm(!showForm); }}
            className="d-flex align-items-center gap-2"
          >
            {showForm ? "Cancelar" : <><FaPlus /> Novo Membro</>}
          </Button>
        )}
      </div>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <MembroForm
              membro={membroToEdit}
              onSave={handleSaveMembro}
              onCancel={() => setShowForm(false)}
            />
          </Col>
        </Row>
      )}

      {/* NOVO COMPONENTE DE FILTRO */}
      {/* Ele atualiza o estado 'membros' sempre que os filtros mudam */}
      <MembroFiltro onFiltersChange={setMembros} />

      <Row>
        <MembroList 
          membros={membros}
          onDelete={canManage ? (id) => { setMembroToDelete(id); setShowDeleteModal(true); } : null}
          onEdit={canManage ? (m) => { setMembroToEdit(m); setShowForm(true); } : null}
        />        
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja remover este membro?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteMembro}>Excluir Membro</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Membros;