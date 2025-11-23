import { Button, Col, Container, Row, Modal, Card, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaWallet, FaPlus, FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from 'xlsx'; // Importar a biblioteca

import FluxoList from "../components/FluxoList";
import FluxoForm from "../components/FluxoForm";
import FluxoFiltro from "../components/FluxoFiltro";
import fluxoService from "../services/fluxoService";

const FluxoCaixa = () => {
  const [showForm, setShowForm] = useState(false);
  const [fluxos, setFluxos] = useState([]);
  const [filteredFluxos, setFilteredFluxos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categorias, setCategorias] = useState([
    "Dízimo", "Doação", "Venda", "Despesa", "Outros"
  ]);
  
  const [fluxoToEdit, setFluxoToEdit] = useState(null);
  const [fluxoToDelete, setFluxoToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cálculos para o Dashboard
  const totalEntradas = filteredFluxos
    .filter(f => f.tipo === 'entrada')
    .reduce((acc, curr) => acc + Number(curr.valor), 0);

  const totalSaidas = filteredFluxos
    .filter(f => f.tipo === 'saida')
    .reduce((acc, curr) => acc + Number(curr.valor), 0);

  const saldoAtual = totalEntradas - totalSaidas;

  const loadFluxos = async () => {
    try {
      setLoading(true);
      const dados = await fluxoService.getAll();
      setFluxos(dados);
      setFilteredFluxos(dados);
      
      // Atualiza categorias baseadas no que vem do banco
      const catsDoBanco = [...new Set(dados.map(f => f.categoria).filter(Boolean))];
      setCategorias(prev => [...new Set([...prev, ...catsDoBanco])]);
      
    } catch (error) {
      console.error("Erro ao carregar fluxos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFluxos();
  }, []);

  const handleSaveFluxo = async (fluxo) => {
    try {
      if (fluxo.id) {
        await fluxoService.update(fluxo);
      } else {
        await fluxoService.add(fluxo);
      }
      await loadFluxos();
      setShowForm(false);
      setFluxoToEdit(null);
    } catch (error) {
      alert("Erro ao salvar registro");
    }
  };

  const handleEditClick = (fluxo) => {
    setFluxoToEdit(fluxo);
    setShowForm(true);
  };

  const handleConfirmDelete = (id) => {
    setFluxoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteFluxo = async () => {
    await fluxoService.remove(fluxoToDelete);
    await loadFluxos();
    setShowDeleteModal(false);
    setFluxoToDelete(null);
  };

  const handleFilter = ({ tipo, categoria, dataInicio, dataFim }) => {
    let dados = [...fluxos];

    if (tipo !== "todos") dados = dados.filter((f) => f.tipo === tipo);
    if (categoria !== "todos") dados = dados.filter((f) => f.categoria === categoria);
    if (dataInicio) dados = dados.filter((f) => f.data >= dataInicio);
    if (dataFim) dados = dados.filter((f) => f.data <= dataFim);

    setFilteredFluxos(dados);
  };

  // --- FUNÇÕES DE RELATÓRIO ---

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Formata os dados para o Excel
    const dadosParaExcel = filteredFluxos.map(item => ({
      "Descrição": item.descricao,
      "Categoria": item.categoria,
      "Data": new Date(item.data).toLocaleDateString("pt-BR"),
      "Tipo": item.tipo === 'entrada' ? 'Entrada' : 'Saída',
      "Valor": Number(item.valor).toFixed(2)
    }));

    // Cria a planilha
    const ws = XLSX.utils.json_to_sheet(dadosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fluxo de Caixa");

    // Salva o arquivo
    XLSX.writeFile(wb, `Relatorio_Fluxo_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
  };

  return (
    <Container className="py-4">
      {/* Cabeçalho e Botões */}
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Fluxo de Caixa</h2>
          <span className="text-muted">Gerencie as finanças da igreja</span>
        </div>
        
        <div className="d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={handlePrint}
            title="Imprimir Relatório"
          >
            <FaPrint /> Imprimir
          </Button>
          
          <Button 
            variant="outline-success" 
            onClick={handleExportExcel}
            title="Baixar Excel"
          >
            <FaFileExcel /> Excel
          </Button>

          <Button 
            variant="success" 
            onClick={() => { setFluxoToEdit(null); setShowForm(true); }}
            className="d-flex align-items-center gap-2"
          >
            <FaPlus /> Novo
          </Button>
        </div>
      </div>

      {/* Título apenas para impressão */}
      <div className="d-none d-print-block text-center mb-4">
        <h3>Relatório Financeiro - PIB</h3>
        <p>Gerado em: {new Date().toLocaleString()}</p>
      </div>

      {/* Cards de Resumo (Dashboard) */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-success h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">Entradas</span>
                  <h4 className="mb-0 text-success mt-1">R$ {totalEntradas.toFixed(2)}</h4>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success no-print">
                  <FaArrowUp />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm border-start border-4 border-danger h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">Saídas</span>
                  <h4 className="mb-0 text-danger mt-1">R$ {totalSaidas.toFixed(2)}</h4>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger no-print">
                  <FaArrowDown />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className={`border-0 shadow-sm border-start border-4 h-100 ${saldoAtual >= 0 ? 'border-primary' : 'border-warning'}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">Saldo Atual</span>
                  <h4 className={`mb-0 mt-1 ${saldoAtual >= 0 ? 'text-primary' : 'text-warning'}`}>
                    R$ {saldoAtual.toFixed(2)}
                  </h4>
                </div>
                <div className={`bg-opacity-10 p-3 rounded-circle ${saldoAtual >= 0 ? 'bg-primary text-primary' : 'bg-warning text-warning'} no-print`}>
                  <FaWallet />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Formulário */}
      {showForm && (
        <div className="no-print">
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">{fluxoToEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</h5>
            </Card.Header>
            <Card.Body>
              <FluxoForm 
                onSave={handleSaveFluxo} 
                fluxo={fluxoToEdit} 
                onCancel={() => setShowForm(false)}
              />
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="no-print">
        <FluxoFiltro categorias={categorias} onFilter={handleFilter} />
      </div>

      {/* Lista de Registros */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <FluxoList 
          fluxos={filteredFluxos} 
          onDelete={handleConfirmDelete}
          onEdit={handleEditClick}
        />
      )}

      {/* Resumo final para impressão */}
      <div className="d-none d-print-block mt-4 text-end">
        <p><strong>Saldo Final do Período: R$ {saldoAtual.toFixed(2)}</strong></p>
      </div>

      {/* Modal de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="no-print">
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este registro permanentemente?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteFluxo}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FluxoCaixa;