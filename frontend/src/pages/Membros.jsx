import { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col, Button, Modal, Spinner, Alert } from "react-bootstrap";
import { FaPlus, FaFileExcel, FaPrint } from "react-icons/fa"; // Importar ícones novos
import * as XLSX from 'xlsx'; // Importar biblioteca Excel
import { useAuth } from "../hooks/useAuth";

import MembroForm from "../components/MembroForm"; 
import MembroList from "../components/MembroList";
import MembroFiltro from "../components/MembroFiltro"; 
import membroService from "../services/membroService"; 

const Membros = () => {
  const { user } = useAuth();
  const canManage = user && (user.role === 'admin' || user.role === 'operador');

  // Estados
  const [membros, setMembros] = useState([]); 
  const [membrosFiltrados, setMembrosFiltrados] = useState([]); 
  
  // UI
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ações
  const [membroToEdit, setMembroToEdit] = useState(null);
  const [membroToDelete, setMembroToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- BUSCAR DADOS ---
  const fetchMembros = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const dados = await membroService.getAll(); 
      setMembros(dados);
      setMembrosFiltrados(dados); 
    } catch (err) {
      console.error("Erro ao carregar membros:", err);
      setError("Erro ao carregar a lista de membros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembros();
  }, [fetchMembros]);

  // --- FILTRAGEM LOCAL ---
  const handleFilter = (filtros) => {
    const resultado = membros.filter((membro) => {
      const matchNome = !filtros.nome || (membro.nome && membro.nome.toLowerCase().includes(filtros.nome.toLowerCase()));
      const matchCidade = !filtros.cidade || (membro.cidade && membro.cidade.toLowerCase().includes(filtros.cidade.toLowerCase()));
      const matchStatus = !filtros.status || (membro.status === filtros.status);
      const matchGenero = !filtros.genero || (membro.genero === filtros.genero);
      return matchNome && matchCidade && matchStatus && matchGenero;
    });
    setMembrosFiltrados(resultado);
  };

  // --- NOVA FUNÇÃO: IMPRIMIR ---
  const handlePrint = () => {
    window.print();
  };

  // --- NOVA FUNÇÃO: EXPORTAR EXCEL ---
  const handleExportExcel = () => {
    // 1. Formata os dados para o Excel (escolha quais colunas quer exportar)
    const dadosParaExcel = membrosFiltrados.map(m => ({
      "Nome Completo": m.nome,
      "Email": m.email || "-",
      "Telefone": m.telefone || "-",
      "Cidade": m.cidade || "-",
      "Status": m.status,
      "Gênero": m.genero,
      "Data Nasc.": m.dataNascimento ? new Date(m.dataNascimento).toLocaleDateString('pt-BR') : "-"
    }));

    // 2. Cria a planilha
    const ws = XLSX.utils.json_to_sheet(dadosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Membros");

    // 3. Baixa o arquivo
    const dataAtual = new Date().toLocaleDateString().replace(/\//g, '-');
    XLSX.writeFile(wb, `Relatorio_Membros_${dataAtual}.xlsx`);
  };

  // --- HANDLERS PADRÃO ---
  const handleSaveMembro = async (membro) => {
    try {
      if (membro.id) await membroService.update(membro);
      else await membroService.add(membro);
      await fetchMembros(); 
      setShowForm(false);
    } catch (err) {
      console.error(err);
      throw err; 
    }
  };

  const handleDeleteMembro = async () => {
    try {
      if (membroToDelete) {
        await membroService.remove(membroToDelete);
        await fetchMembros();
        setShowDeleteModal(false);
      }
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  return (
    <Container className="py-4">
      {/* Cabeçalho com Botões de Ação */}
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <div>
          <h2 className="mb-0 fw-bold text-secondary">Gestão de Membros</h2>
          <span className="text-muted">Administre os membros da igreja</span>
        </div>
        
        <div className="d-flex gap-2">
          {/* Botão Imprimir */}
          <Button variant="outline-secondary" onClick={handlePrint} title="Imprimir Lista">
            <FaPrint /> <span className="d-none d-md-inline">Imprimir</span>
          </Button>

          {/* Botão Excel */}
          <Button variant="outline-success" onClick={handleExportExcel} title="Baixar Excel">
            <FaFileExcel /> <span className="d-none d-md-inline">Excel</span>
          </Button>

          {/* Botão Novo (Só admin/operador) */}
          {canManage && !showForm && (
            <Button variant="success" onClick={() => { setMembroToEdit(null); setShowForm(true); }} className="d-flex align-items-center gap-2">
              <FaPlus /> <span className="d-none d-md-inline">Novo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Título visível apenas na impressão */}
      <div className="d-none d-print-block text-center mb-4">
        <h3>Relatório de Membros - PIB</h3>
        <p>Gerado em: {new Date().toLocaleString()}</p>
        <p>Total de registros: {membrosFiltrados.length}</p>
        <hr />
      </div>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible className="no-print">{error}</Alert>}

      {showForm && (
        <Row className="mb-4 no-print"> {/* Adicionado no-print para não sair form na impressão */}
          <Col>
            <MembroForm
              membro={membroToEdit}
              onSave={handleSaveMembro}
              onCancel={() => setShowForm(false)}
            />
          </Col>
        </Row>
      )}

      {/* Filtros (Escondidos na impressão) */}
      <div className="no-print">
        <MembroFiltro onFiltersChange={handleFilter} />
      </div>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <MembroList 
              membros={membrosFiltrados} 
              onDelete={canManage ? (id) => { setMembroToDelete(id); setShowDeleteModal(true); } : null}
              onEdit={canManage ? (m) => { setMembroToEdit(m); setShowForm(true); window.scrollTo(0,0); } : null}
            />        
          )}
        </Col>
      </Row>

      {/* Rodapé da impressão com contagem */}
      <div className="d-none d-print-block mt-4 text-end">
        <small>Fim do relatório.</small>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="no-print">
        <Modal.Header closeButton className="bg-danger text-white"><Modal.Title>Confirmar Exclusão</Modal.Title></Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteMembro}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Membros;