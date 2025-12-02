import { Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaVideo, FaImage } from "react-icons/fa";
import EventoStatusBadge from "./EventoStatusBadge";

const EventoList = ({ eventos, onDelete, onEdit }) => {
  const MEDIA_URL = 'http://localhost:3000/uploads/';

  const isVideo = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    return ['mp4', 'webm', 'ogg'].includes(ext);
  };

  if (eventos.length === 0) {
    return (
      <div className="col-12 text-center p-5 text-muted bg-white rounded shadow-sm">
        <h4>Nenhum evento encontrado</h4>
        {/* Só sugere adicionar se a função onEdit (que usamos para criar) existir (se for admin) */}
        {onEdit && <p>Clique em "Novo Evento" para adicionar.</p>}
      </div>
    );
  }

  return (
    <>
      {eventos.map((evento) => {
        const dateObj = new Date(evento.brand);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');

        return (
          <Col md={6} lg={4} className="mb-4" key={evento.id}>
            <Card className="h-100 border-0 shadow-sm hover-card overflow-hidden">
              
              <div style={{ height: '200px', backgroundColor: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
                {evento.arquivo ? (
                   isVideo(evento.arquivo) ? (
                     <div className="d-flex align-items-center justify-content-center h-100 text-secondary bg-dark bg-opacity-10">
                        <FaVideo size={40} />
                     </div>
                   ) : (
                     <img 
                       src={`${MEDIA_URL}${evento.arquivo}`} 
                       alt={evento.titulo}
                       style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }}
                       className="card-img-top"
                     />
                   )
                ) : (
                   <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      <FaImage size={40} opacity={0.3} />
                   </div>
                )}
                
                <div className="position-absolute top-0 end-0 m-2 shadow-sm">
                   <EventoStatusBadge category={evento.category} />
                </div>
              </div>

              <Card.Body className="d-flex flex-column pt-3">
                <div className="d-flex align-items-start mb-3">
                  <div className="text-center border rounded p-2 me-3 bg-white shadow-sm" style={{ minWidth: '55px', lineHeight: 1 }}>
                    <span className="d-block fw-bold h4 mb-0 text-primary">{day}</span>
                    <span className="d-block x-small fw-bold text-secondary" style={{fontSize: '0.7rem'}}>{month}</span>
                  </div>
                  
                  <div className="flex-grow-1">
                    <Card.Title className="fw-bold text-dark mb-1 h6 text-truncate" title={evento.titulo}>
                      {evento.titulo || "Sem Título"}
                    </Card.Title>
                    <p className="text-muted small mb-0 text-truncate" style={{maxWidth: '200px'}}>
                        {evento.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-top d-flex gap-2">
                  <Link to={`/evento/${evento.id}`} className="btn btn-outline-secondary btn-sm flex-grow-1">
                    Ver Detalhes
                  </Link>
                  
                  {/* 1. Renderização condicional do botão Editar */}
                  {onEdit && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(evento)}
                      title="Editar"
                    >
                      <FaEdit />
                    </Button>
                  )}

                  {/* 2. Renderização condicional do botão Excluir */}
                  {onDelete && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(evento.id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </Button>
                  )}
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