import { Container, Col, Card, Row, Button, Badge, Spinner } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaTag, FaEdit } from "react-icons/fa";
import eventoService from "../services/eventoService";

const EventoDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // URL base para arquivos
    const MEDIA_URL = 'http://localhost:3000/uploads/';

    useEffect(() => {
        const carregarEvento = async () => {
            try {
                const data = await eventoService.getById(id);
                if (data) {
                    setEvento(data);
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarEvento();
    }, [id]);

    const isVideo = (filename) => {
        if(!filename) return false;
        const ext = filename.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg'].includes(ext);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Carregando detalhes do evento...</p>
            </Container>
        );
    }

    if (!evento) {
        return (
            <Container className="py-5 text-center">
                <h3>Evento não encontrado</h3>
                <Button as={Link} to="/eventos" variant="secondary" className="mt-3">Voltar para Lista</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    {/* Botão Voltar */}
                    <Button 
                        variant="link" 
                        className="text-decoration-none text-secondary mb-3 ps-0" 
                        onClick={() => navigate('/eventos')}
                    >
                        <FaArrowLeft className="me-2" /> Voltar para Agenda
                    </Button>

                    <Card className="shadow-sm border-0 overflow-hidden">
                        {/* Área de Mídia (Imagem ou Vídeo) */}
                        {evento.arquivo ? (
                            <div className="bg-dark text-center" style={{ minHeight: '300px', maxHeight: '500px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isVideo(evento.arquivo) ? (
                                    <video controls style={{ maxWidth: '100%', maxHeight: '500px', width: '100%' }}>
                                        <source src={`${MEDIA_URL}${evento.arquivo}`} />
                                        Seu navegador não suporta a reprodução de vídeos.
                                    </video>
                                ) : (
                                    <img 
                                        src={`${MEDIA_URL}${evento.arquivo}`} 
                                        alt={evento.titulo} 
                                        className="img-fluid"
                                        style={{ width: '100%', objectFit: 'contain', maxHeight: '500px' }}
                                    />
                                )}
                            </div>
                        ) : (
                            // Placeholder colorido se não houver imagem
                            <div className="bg-primary p-5 text-center text-white">
                                <FaCalendarAlt size={64} className="opacity-50" />
                            </div>
                        )}

                        <Card.Body className="p-4 p-lg-5">
                            {/* Cabeçalho do Evento */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 border-bottom pb-4">
                                <div>
                                    <div className="d-flex gap-2 mb-2">
                                        <Badge bg="primary" className="d-flex align-items-center gap-1">
                                            <FaTag size={10}/> {evento.category}
                                        </Badge>
                                        <Badge bg="light" text="dark" className="border d-flex align-items-center gap-1">
                                            <FaCalendarAlt size={10}/> {new Date(evento.brand).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                                        </Badge>
                                    </div>
                                    <h1 className="fw-bold text-dark mb-0 display-6">{evento.titulo || "Evento sem Título"}</h1>
                                </div>
                                
                                {/* Ações (Opcional, se quiser colocar botão de editar aqui) */}
                                {/* <Button variant="outline-secondary" size="sm" className="mt-3 mt-md-0">
                                    <FaEdit className="me-2"/> Editar
                                </Button> */}
                            </div>

                            {/* Descrição */}
                            <div className="mb-4">
                                <h5 className="text-secondary fw-bold mb-3">Sobre o Evento</h5>
                                <p className="lead fs-6" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                                    {evento.description}
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EventoDetalhe;