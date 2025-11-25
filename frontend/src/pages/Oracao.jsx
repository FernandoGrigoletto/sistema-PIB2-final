import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth"; // Import do hook

import OracaoList from "../components/OracaoList";
import oracaoService from "../services/oracaoService";
import OracaoForm from "../components/OracaoForm";

const Oracoes = () => {
  const { user } = useAuth(); // Obtém o usuário do contexto
  
  // Verifica se é Admin ou Operador
  const isAdmin = user && (user.role === 'admin' || user.role === 'operador');

  const [showForm, setShowForm] = useState(false);
  const [oracoes, setOracoes] = useState([]);
  const [oracaoToDelete, setOracaoToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadOracao = async () => {
    try {
      const dados = await oracaoService.getAll();
      const sorted = dados.sort((a, b) => new Date(b.data) - new Date(a.data));
      setOracoes(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOracao();
  }, []);

  const handleSaveOracao = async (oracao) => {
    try {
      if (oracao.id > 0) {
        await oracaoService.update(oracao);
      } else {
        await oracaoService.add(oracao);
      }
      await loadOracao();
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = (id) => {
    setOracaoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteOracao = async () => {
    await oracaoService.remove(oracaoToDelete);
    await loadOracao();
    setShowDeleteModal(false);
    setOracaoToDelete(null);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Mural de Oração</h2>
          <span className="text-muted">Compartilhe e interceda pelos irmãos</span>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(!showForm)} 
          className="d-flex align-items-center gap-2"
        >
          {showForm ? "Fechar" : <><FaPlus /> Fazer Pedido</>}
        </Button>
      </div>

      {showForm && (
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <OracaoForm onSave={handleSaveOracao} />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          {/* Passamos a prop isAdmin para a lista */}
          <OracaoList 
            oracao={oracoes} 
            onDelete={isAdmin ? handleConfirmDelete : null} // Só admin pode deletar
            isAdmin={isAdmin} // Nova propriedade para controlar visibilidade do contato
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja remover este pedido de oração?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteOracao}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Oracoes;