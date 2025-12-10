import { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Modal, Card } from "react-bootstrap";
import { FaTrash, FaPrint } from "react-icons/fa"; // <--- Importei FaPrint
import oracaoService from "../services/oracaoService";

const PedidosOracao = () => {
  const [oracoes, setOracoes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [oracaoToDelete, setOracaoToDelete] = useState(null);

  const loadOracoes = async () => {
    try {
      const data = await oracaoService.getAll();
      const sorted = data.sort((a, b) => new Date(b.data) - new Date(a.data));
      setOracoes(sorted);
    } catch (error) {
      console.error("Erro ao carregar orações:", error);
    }
  };

  useEffect(() => {
    loadOracoes();
  }, []);

  const handleConfirmDelete = (id) => {
    setOracaoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await oracaoService.remove(oracaoToDelete);
      await loadOracoes();
      setShowDeleteModal(false);
      setOracaoToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  // Função simples de impressão
  const handlePrint = () => {
    window.print();
  };

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
            <h2 className="fw-bold text-secondary mb-0">Gestão de Orações</h2>
            <Badge bg="primary" className="fs-6">{oracoes.length}</Badge>
        </div>
        
        {/* Botão de Imprimir (Oculto na impressão pela classe 'no-print' que criaremos) */}
        <Button 
            variant="outline-secondary" 
            className="d-flex align-items-center gap-2 no-print" 
            onClick={handlePrint}
        >
            <FaPrint /> Imprimir Lista
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="m-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Data</th>
                <th>Nome</th>
                <th>Pedido</th>
                {/* Ações somem na impressão */}
                <th className="text-end pe-4 print-hide-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {oracoes.length > 0 ? (
                oracoes.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 text-muted" style={{whiteSpace: 'nowrap'}}>
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="fw-bold text-primary">
                      {item.nome} <br/>
                      {item.email && <small className="text-muted fw-normal">{item.email}</small>}
                    </td>
                    <td>
                      <div style={{ maxWidth: '400px', whiteSpace: 'normal' }}>
                        {item.pedido}
                      </div>
                    </td>
                    <td className="text-end pe-4 print-hide-col">
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleConfirmDelete(item.id)}
                        title="Excluir pedido"
                        className="no-print" // Garante que o botão não saia na folha
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    Nenhum pedido de oração encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="no-print">
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este pedido de oração permanentemente?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PedidosOracao;