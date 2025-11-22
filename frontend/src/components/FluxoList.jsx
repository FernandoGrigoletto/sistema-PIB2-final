import { Table, Button, Badge, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const FluxoList = ({ fluxos, onDelete, onEdit }) => {
  return (
    <Card className="shadow-sm border-0">
      <div className="table-responsive">
        <Table hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="py-3 ps-3">Descrição</th>
              <th className="py-3">Categoria</th>
              <th className="py-3">Data</th>
              <th className="py-3">Tipo</th>
              <th className="py-3">Valor</th>
              <th className="py-3 text-end pe-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fluxos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              fluxos.map((f) => (
                <tr key={f.id}>
                  <td className="ps-3 fw-medium">{f.descricao}</td>
                  <td><Badge bg="secondary" className="fw-normal">{f.categoria}</Badge></td>
                  <td>{new Date(f.data).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</td>
                  <td>
                    <Badge bg={f.tipo === "entrada" ? "success" : "danger"}>
                      {f.tipo.toUpperCase()}
                    </Badge>
                  </td>
                  <td className={f.tipo === "entrada" ? "text-success fw-bold" : "text-danger fw-bold"}>
                    R$ {Number(f.valor).toFixed(2)}
                  </td>
                  <td className="text-end pe-3">
                    <div className="d-flex gap-2 justify-content-end">
                      {onEdit && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => onEdit(f)}
                          title="Editar"
                        >
                          <FaEdit />
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(f.id)}
                        title="Excluir"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default FluxoList;

