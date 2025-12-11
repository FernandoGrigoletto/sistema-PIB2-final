import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

import MembroForm from "../components/MembroForm"; 
import membroService from "../services/membroService"; 
import MembroList from "../components/MembroList";
import MembroFiltro from "../components/MembroFiltro"; 

const Membros = () => {
  const { user } = useAuth();
  // Regra de permissão: Apenas Admin e Operador podem criar/editar/excluir
  const canManage = user && (user.role === 'admin' || user.role === 'operador');

  const [showForm, setShowForm] = useState(false);
  const [membros, setMembros] = useState([]);
  const [filtros, setFiltros] = useState({}); // Estado dos filtros centralizado aqui
  
  const [membroToDelete, setMembroToDelete] = useState(null);
  const [membroToEdit, setMembroToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função centralizada para buscar dados
  const fetchMembros = useCallback(async () => {
    try {
      // Passamos o estado 'filtros' para o serviço
      const dados = await membroService.getAll(filtros);
      setMembros(dados);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    }
  }, [filtros]);

  // Carrega os dados sempre que 'filtros' mudar
  useEffect(() => {
    fetchMembros();
  }, [fetchMembros]);

  const handleSaveMembro = async (membro) => {
    try {
      if (membro.id) {
        await membroService.update(membro);
      } else {
        await membroService.add(membro);
      }
      
      // Recarrega os dados mantendo o filtro atual!
      await fetchMembros();
      
      setShowForm(false);
      setMembroToEdit(null);
    } catch (error) {
      // O erro já é logado/tratado no MembroForm, mas aqui garantimos segurança
      console.error("Erro ao salvar:", error);
      throw error; // Repassa para o form exibir msg de erro se necessário
    }
  };

  const handleDeleteMembro = async () => {
    try {
        if (membroToDelete) {
            await membroService.remove(membroToDelete);
            
            // Opção 1: Recarregar do servidor (mais seguro)
            await fetchMembros();
            
            // Opção 2 (Otimista): Remover localmente para evitar loading
            // setMembros(prev => prev.filter(m => m.id !== membroToDelete));
            
            setShowDeleteModal(false);
            setMembroToDelete(null);
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
  };

  const handleEditClick = (membro) => {
      setMembroToEdit(membro);
      setShowForm(true);
      // Rola a página para o topo onde o formulário abre
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
      setShowForm(false);
      setMembroToEdit(null);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Gestão de Membros</h2>
          <span className="text-muted">Administre os membros da igreja</span>
        </div>
        
        {canManage && !showForm && (
          <Button 
            variant="success" 
            onClick={() => { setMembroToEdit(null); setShowForm(true); }}
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            <FaPlus /> Novo Membro
          </Button>
        )}
      </div>

      {showForm && (
        <Row className="mb-4 fade-in">
          <Col>
            <MembroForm
              membro={membroToEdit}
              onSave={handleSaveMembro}
              onCancel={handleCancelForm}
            />
          </Col>
        </Row>
      )}

      {/* Passamos o setFiltros para o componente filho */}
      <MembroFiltro onFilterChange={setFiltros} />

      <Row>
        <Col>
            <MembroList 
            membros={membros}
            onDelete={canManage ? (id) => { setMembroToDelete(id); setShowDeleteModal(true); } : null}
            onEdit={canManage ? handleEditClick : null}
            />        
        </Col>
      </Row>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
            Tem certeza que deseja remover este membro permanentemente?
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