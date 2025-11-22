import { Table, Button, Badge, Card } from "react-bootstrap";

const FluxoList = ({ fluxos, onDelete }) => {
  // Calcular saldo total
  const calcularSaldo = () => {
    return fluxos.reduce((acc, f) => {
      return f.tipo === "entrada" ? acc + f.valor : acc - f.valor;
    }, 0);
  };

  return (
    <>
      <Card className="mb-3 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Saldo Atual</h5>
          <h4
            className={`mb-0 ${
              calcularSaldo() >= 0 ? "text-success" : "text-danger"
            }`}
          >
            R$ {calcularSaldo().toFixed(2)}
          </h4>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fluxos.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                Nenhum registro encontrado
              </td>
            </tr>
          )}
          {fluxos.map((f) => (
            <tr key={f.id}>
              <td>{f.descricao}</td>
              <td className={f.tipo === "entrada" ? "text-success" : "text-danger"}>
                R$ {f.valor.toFixed(2)}
              </td>
              <td>
                <Badge bg={f.tipo === "entrada" ? "success" : "danger"}>
                  {f.tipo.toUpperCase()}
                </Badge>
              </td>
              <td>{f.categoria}</td>
              <td>{f.data}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(f.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default FluxoList;

