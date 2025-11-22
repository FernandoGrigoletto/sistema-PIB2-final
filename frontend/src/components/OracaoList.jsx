import { Button, Card, Table } from "react-bootstrap";
import {  FaTrash } from "react-icons/fa";

const OracaoList = ({ oracao, onDelete }) => {
 

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Lista de Orações</h5>
      </Card.Header>
      <Card.Body>
        {oracao.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted">Nenhuma oração cadastrada.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Data</th>                  
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Pedido</th>
                  
                </tr>
              </thead>

              <tbody>
                {oracao.map((oracao) => (
                  <tr key={oracao.id}>
                    <td>{oracao.id}</td>
                    <td>{new Date(oracao.data).toLocaleDateString("pt-BR")}</td>
                    <td>{oracao.nome}</td>
                    <td>{oracao.contato}</td>
                    <td>{oracao.pedido}</td>
                    

                    <td>
                      <div className="d-flex gap-2">
                        

                        <Button
                          size="sm"
                          onClick={() => onDelete(oracao.id)}
                          variant="outline-danger"
                        >
                          <FaTrash></FaTrash> Excluir
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
export default OracaoList;