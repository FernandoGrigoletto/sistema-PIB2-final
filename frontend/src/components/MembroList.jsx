import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import MembroStatusBadge from "./MembroStatusBadge";
import { FaEdit, FaTrash } from "react-icons/fa";

const MembroList = ({ membros, onDelete, onEdit }) => {
  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Lista de Membros</h5>
      </Card.Header>
      <Card.Body>
        {membros.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted">Nenhum membro cadastrado.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Cidade</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Data de Nascimento</th>
                  <th>Gênero</th>
                  <th>Telefone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {membros
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                  .map((membro) => (
                    <tr key={membro.id}>
                      <td>{membro.id}</td>
                      <td>
                        <Link to={`/membro/${membro.id}`}> {membro.nome} </Link>
                      </td>
                      <td>{membro.endereco}</td>
                      <td>{membro.cidade}</td>
                      <td>{membro.email}</td>
                      <td>{membro.cpf}</td>
                      <td>{formatarData(membro.nasc)}</td>
                      <td>{membro.genero}</td>
                      <td>{membro.telefone}</td>
                      <td>
                        <MembroStatusBadge
                          status={membro.status}
                        ></MembroStatusBadge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onEdit(membro)}
                            variant="outline-primary"
                          >
                            <FaEdit></FaEdit>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onDelete(membro.id)}
                            variant="outline-danger"
                          >
                            <FaTrash></FaTrash>
                            Excluir
                          </Button>
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
