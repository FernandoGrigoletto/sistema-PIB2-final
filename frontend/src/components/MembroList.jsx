import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom"; // Link mantido caso precise no futuro
import MembroStatusBadge from "./MembroStatusBadge";
import { FaEdit, FaTrash } from "react-icons/fa";

const MembroList = ({ membros, onDelete, onEdit }) => {
  
  const formatarData = (dataISO) => {
    if (!dataISO) return "-";
    const data = new Date(dataISO);
    // Ajuste de fuso horário simples para exibir a data correta
    // data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold text-primary">Lista de Membros</h5>
      </Card.Header>
      <Card.Body className="p-0">
        {membros.length === 0 ? (
          <div className="text-center p-5">
            <p className="text-muted mb-0">Nenhum membro encontrado.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>Nascimento</th>
                  <th>Gênero</th> {/* <-- ADICIONADO NO CABEÇALHO */}
                  <th>Status</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {membros
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                  .map((membro) => (
                    <tr key={membro.id}>
                      <td className="text-muted small">#{membro.id}</td>
                      <td>
                        <span className="fw-bold text-dark text-decoration-none">
                            {membro.nome}
                        </span>
                      </td>
                      <td>{membro.cpf || "-"}</td>
                      <td>{membro.email || "-"}</td>
                      <td>{membro.telefone || "-"}</td>
                      <td>{membro.cidade || "-"}</td>
                      <td>{formatarData(membro.nasc)}</td>
                      <td>{membro.genero || "-"}</td> {/* <-- ADICIONADO NA LINHA */}
                      <td>
                        <MembroStatusBadge status={membro.status} />
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                          {onEdit && (
                            <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => onEdit(membro)}
                                title="Editar"
                            >
                                <FaEdit />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => onDelete(membro.id)}
                                title="Excluir"
                            >
                                <FaTrash />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MembroList;
