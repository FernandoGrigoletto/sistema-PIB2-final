import { Table, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const MembroList = ({ membros, onEdit, onDelete }) => {
  if (!membros || membros.length === 0) {
    return <div className="text-center p-4 text-muted">Nenhum membro encontrado.</div>;
  }

  // Função auxiliar para cor do status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Ativo": return "success";
      case "Inativo": return "danger";
      case "Ausente": return "warning";
      case "Visitante": return "info";
      default: return "secondary";
    }
  };

  // Formata data para PT-BR
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="table-responsive shadow-sm rounded">
      <Table hover className="align-middle mb-0 bg-white">
        <thead className="bg-light">
          <tr>
            <th className="py-3 ps-4">Nome</th>
            <th>Contato</th>
            <th>Cidade</th>
            <th>Status</th>
            <th className="text-end pe-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {membros.map((membro) => (
            <tr key={membro.id}>
              <td className="ps-4">
                <div className="fw-bold text-dark">{membro.nome}</div>
                <small className="text-muted">{membro.genero} • {formatDate(membro.nasc)}</small>
              </td>
              <td>
                <div style={{fontSize: '0.9rem'}}>{membro.telefone}</div>
                <small className="text-muted" style={{fontSize: '0.8rem'}}>{membro.email}</small>
              </td>
              <td>{membro.cidade}</td>
              <td>
                <Badge bg={getStatusBadge(membro.status)} pill>
                  {membro.status}
                </Badge>
              </td>
              <td className="text-end pe-4">
                <Button 
                  variant="link" 
                  className="text-primary p-1 me-2" 
                  onClick={() => onEdit(membro)}
                  title="Editar"
                >
                  <FaEdit size={18} />
                </Button>
                <Button 
                  variant="link" 
                  className="text-danger p-1" 
                  onClick={() => onDelete(membro.id)}
                  title="Excluir"
                >
                  <FaTrash size={18} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MembroList;