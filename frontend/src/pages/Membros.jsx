import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Modal, Spinner, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

import MembroForm from "../components/MembroForm"; 
import MembroList from "../components/MembroList";
import MembroFiltro from "../components/MembroFiltro"; 
import membroService from "../services/membroService"; 

const Membros = () => {
  const { user } = useAuth();
  // Regra de permissão: Apenas Admin e Operador podem criar/editar/excluir
  const canManage = user && (user.role === 'admin' || user.role === 'operador');

  // Estados de Dados
  const [membros, setMembros] = useState([]);
  const [filtros, setFiltros] = useState({}); // Estado centralizado dos filtros
  
  // Estados de Interface (UI)
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Feedback de carregamento
  const [error, setError] = useState("");        // Feedback de erro

  // Estados de Ação
  const [membroToEdit, setMembroToEdit] = useState(null);
  const [membroToDelete, setMembroToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- BUSCAR DADOS ---
  const fetchMembros = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Passamos o estado 'filtros' para o serviço
      const dados = await membroService.getAll(filtros);
      setMembros(dados);
    } catch (err) {
      console.error("Erro ao carregar membros:", err);
      setError("Erro ao carregar a lista de membros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Carrega os dados sempre que 'filtros' mudar (incluindo na montagem inicial)
  useEffect(() => {
    fetchMembros();
  }, [fetchMembros]);


  // --- HANDLERS (Ações do Usuário) ---

  const handleCreateNew = () => {
    setMembroToEdit(null);
    setShowForm(true);
    setError("");
  };

  const handleEditClick = (membro) => {
    setMembroToEdit(membro);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveMembro = async (membro) => {
    try {
      if (membro.id) {
        await membroService.update(membro);
      } else {
        await membroService.add(membro);
      }
      
      // Recarrega os dados mantendo o filtro atual
      await fetchMembros();
      
      setShowForm(false);
      setMembroToEdit(null);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      // Repassa o erro para o formulário (ex: para exibir erro de CPF duplicado)
      throw err; 
    }
  };

  const handleDeleteMembro = async () => {
    try {
      if (membroToDelete) {
        await membroService.remove(membroToDelete);
        
        // Atualiza a lista
        await fetchMembros();
        
        setShowDeleteModal(false);
        setMembroToDelete(null);
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Não foi possível excluir o membro.");
    }
  };

  return (
    <Container className="py-4">
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Gestão de Membros</h2>
          <span className="text-muted">Administre os membros da igreja</span>
        </div>
        
        {canManage && !showForm && (
          <Button 
            variant="success" 
            onClick={handleCreateNew}
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            <FaPlus /> Novo Membro
          </Button>
        )}
      </div>

      {/* Alerta de Erro Global */}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {/* Formulário (Visível apenas quando showForm for true) */}
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

      {/* Filtros */}
      {/* Ao digitar no filtro, setFiltros atualiza -> fetchMembros roda -> lista atualiza */}
      <MembroFiltro onFilterChange={setFiltros} />

      {/* Lista de Membros */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Carregando dados...</p>
            </div>
          ) : (
            <MembroList 
              membros={membros}
              onDelete={canManage ? (id) => { setMembroToDelete(id); setShowDeleteModal(true); } : null}
              onEdit={canManage ? handleEditClick : null}
            />        
          )}
        </Col>
      </Row>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 text-center">
            <p className="lead mb-0">Tem certeza que deseja remover este membro permanentemente?</p>
            <small className="text-muted">Esta ação não pode ser desfeita.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteMembro}>Excluir Membro</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Membros;