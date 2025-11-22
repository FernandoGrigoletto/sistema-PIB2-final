import { Button, Card, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaCalendarAlt, FaClock } from "react-icons/fa";
import EventoStatusBadge from "./EventoStatusBadge"; // Reutilizando seu componente

const EventoList = ({ eventos, onDelete, onEdit }) => {
  if (eventos.length === 0) {
    return (
      <div className="text-center p-5 text-muted bg-white rounded shadow-sm">
        <h4>Nenhum evento encontrado</h4>
        <p>Clique em "Novo Evento" para adicionar.</p>
      </div>
    );
  }

  return (
    <>
      {eventos.map((evento) => {
        const dateObj = new Date(evento.brand);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
        const year = dateObj.getFullYear();

        return (
          <Col md={6} lg={4} className="mb-4" key={evento.id}>
            <Card className="h-100 border-0 shadow-sm hover-card">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  {/* Box da Data */}
                  <div className="text-center border rounded p-2 bg-light" style={{ minWidth: '60px' }}>
                    <span className="d-block fw-bold h4 mb-0 text-primary">{day}</span>
                    <span className="d-block x-small fw-bold text-secondary" style={{fontSize: '0.75rem'}}>{month}</span>
                  </div>
                  
                  <EventoStatusBadge category={evento.category} />
                </div>

                <Card.Title className="fw-bold text-dark mb-2">
                  {evento.description}
                </Card.Title>
                
                <div className="text-muted small mb-3 flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaCalendarAlt /> {dateObj.toLocaleDateString('pt-BR')}
                  </div>
                  {/* Espaço para hora ou local se adicionar no futuro */}
                </div>

                <div className="d-flex gap-2 pt-3 border-top">
                  <Link to={`/evento/${evento.id}`} className="btn btn-outline-secondary btn-sm flex-grow-1">
                    Detalhes
                  </Link>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onEdit(evento)}
                    title="Editar"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(evento.id)}
                    title="Excluir"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </>
  );
};

export default EventoList;
