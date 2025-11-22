import { Button, Card, Row, Col, Badge } from "react-bootstrap";
import { FaTrash, FaUser, FaPhone, FaCalendarAlt, FaQuoteLeft } from "react-icons/fa";

const OracaoList = ({ oracao, onDelete }) => {
  if (oracao.length === 0) {
    return (
      <div className="text-center p-5 bg-white rounded shadow-sm">
        <p className="text-muted mb-0">Nenhum pedido de oração cadastrado no momento.</p>
      </div>
    );
  }

  return (
    <Row>
      {oracao.map((item) => (
        <Col md={6} xl={4} className="mb-4" key={item.id}>
          <Card className="h-100 border-0 shadow-sm hover-card">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                    <FaUser size={14} />
                  </div>
                  <span className="fw-bold text-dark">{item.nome}</span>
                </div>
                <Badge bg="light" text="dark" className="border fw-normal d-flex align-items-center gap-1">
                  <FaCalendarAlt size={10} /> {new Date(item.data).toLocaleDateString("pt-BR")}
                </Badge>
              </div>

              <div className="bg-light p-3 rounded mb-3 flex-grow-1 position-relative">
                <FaQuoteLeft className="text-secondary opacity-25 position-absolute top-0 start-0 m-2" size={20} />
                <p className="mb-0 fst-italic text-secondary ps-2" style={{zIndex: 1, position: 'relative'}}>
                  "{item.pedido}"
                </p>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                <small className="text-muted d-flex align-items-center gap-1">
                  {item.contato && (
                    <>
                      <FaPhone size={12} /> {item.contato}
                    </>
                  )}
                </small>
                
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDelete(item.id)}
                  className="border-0"
                  title="Remover Pedido"
                >
                  <FaTrash /> Remover
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OracaoList;