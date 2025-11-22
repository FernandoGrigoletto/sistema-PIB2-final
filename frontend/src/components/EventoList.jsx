import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";


const EventoList = ({ eventos, onDelete, onEdit }) => {
  

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Lista de Eventos</h5>
      </Card.Header>
      <Card.Body>
        {eventos.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted">Nenhum evento cadastrado.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.id}</td>
                    <td>
                      <Link to={`/evento/${evento.id}`}>
                        {evento.description}
                      </Link>
                    </td>
                    <td>{evento.category}</td>
                    <td>{new Date(evento.brand).toLocaleDateString("pt-BR")}</td>
                    

                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onEdit(evento)}
                          variant="outline-primary"
                        >
                          <FaEdit></FaEdit> Editar
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => onDelete(evento.id)}
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
export default EventoList;
