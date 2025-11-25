import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaPray, 
  FaMoneyBillWave, 
  FaArrowRight, 
  FaVideo, 
  FaImage, 
  FaPlus,
  FaUserPlus 
} from "react-icons/fa";

// Importando a imagem do banner
import bannerImage from '../assets/banner-home.jpg';

// Services
import oracaoService from "../services/oracaoService";
import eventoService from "../services/eventoService";

const Home = () => {
  const [recentOracoes, setRecentOracoes] = useState([]);
  const [nextEvents, setNextEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // URL base para arquivos estáticos do backend
  const MEDIA_URL = 'http://localhost:3000/uploads/';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Carrega dados em paralelo
        const [oracoesData, eventosData] = await Promise.all([
          oracaoService.getAll(),
          eventoService.getAll()
        ]);

        // Pega as 3 últimas orações
        setRecentOracoes(oracoesData.slice(0, 3));

        // Filtra eventos futuros e pega os 3 próximos
        const today = new Date().toISOString().split('T')[0];
        const upcoming = eventosData
          .filter(e => e.brand >= today)
          .sort((a, b) => new Date(a.brand) - new Date(b.brand))
          .slice(0, 3);
        
        setNextEvents(upcoming);

      } catch (error) {
        console.error("Erro ao carregar dados da home:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Função auxiliar para verificar extensão de arquivo
  const isVideo = (filename) => {
    if(!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    return ['mp4', 'webm', 'ogg'].includes(ext);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="home-page">
      {/* --- SEÇÃO DO BANNER (Sem botões agora) --- */}
      <div className="banner-container">
        <img src={bannerImage} alt="Banner Igreja" className="banner-img" />
        <div className="banner-overlay">
          <Container className="text-center text-white position-relative" style={{ zIndex: 2 }}>
            <h1 className="display-3 fw-bold mb-3">Bem-vindo à IgrejaSys</h1>
            <p className="lead fs-4 mb-0">"Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles." (Mateus 18:20)</p>
          </Container>
        </div>
      </div>

      <Container className="py-5" style={{ marginTop: "-60px", position: "relative", zIndex: 3 }}>
        {/* Cards de Acesso Rápido - Botões movidos para cá */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="h-100 shadow border-0 hover-card text-center">
              <Card.Body className="d-flex flex-column align-items-center p-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle mb-3 text-primary">
                  <FaCalendarAlt size={30} />
                </div>
                <Card.Title>Eventos</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  Acompanhe nossa programação completa de cultos e festas.
                </Card.Text>
                {/* BOTÃO VER AGENDA AQUI */}
                <Button as={Link} to="/eventos" variant="outline-primary" className="mt-auto w-100">
                  Ver Agenda
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow border-0 hover-card text-center">
              <Card.Body className="d-flex flex-column align-items-center p-4">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle mb-3 text-success">
                  <FaPray size={30} />
                </div>
                <Card.Title>Orações</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  Um espaço para compartilhar pedidos e interceder pelos irmãos.
                </Card.Text>
                {/* BOTÃO PEDIR ORAÇÃO AQUI */}
                <Button as={Link} to="/oracao" variant="outline-success" className="mt-auto w-100">
                  Pedir Oração
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow border-0 hover-card text-center">
              <Card.Body className="d-flex flex-column align-items-center p-4">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle mb-3 text-warning">
                  <FaUserPlus size={30} />
                </div>
                <Card.Title>Visitantes</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  Novo por aqui? Faça seu cadastro e junte-se à nossa comunidade.
                </Card.Text>
                <Button as={Link} to="/register" variant="outline-warning" className="mt-auto w-100">
                  Cadastre-se
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Seção Principal de Conteúdo */}
        <Row className="g-4">
          {/* Coluna da Esquerda: Próximos Eventos */}
          <Col lg={7}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-secondary mb-0"><FaCalendarAlt className="me-2"/> Próximos Eventos</h4>
                <Link to="/eventos" className="text-decoration-none small fw-bold">Ver todos</Link>
            </div>
            
            {nextEvents.length > 0 ? (
              nextEvents.map((evt) => (
                <Card key={evt.id} className="mb-3 border-0 shadow-sm hover-card overflow-hidden">
                  <Card.Body className="p-0 d-flex">
                    {/* Data Box Lateral */}
                    <div className="bg-light text-center p-3 d-flex flex-column justify-content-center border-end" style={{minWidth: '80px'}}>
                      <span className="fw-bold h4 mb-0 text-primary">{new Date(evt.brand).getDate()}</span>
                      <span className="small text-uppercase fw-bold text-muted">{new Date(evt.brand).toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}</span>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-3 flex-grow-1 d-flex align-items-center">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <Badge bg="info" className="fw-normal">{evt.category}</Badge>
                                {evt.arquivo && (
                                    <span className="text-muted x-small"><FaImage size={10}/> Mídia</span>
                                )}
                            </div>
                            <h6 className="mb-1 fw-bold text-dark">{evt.titulo || "Evento"}</h6>
                            <p className="mb-0 text-muted small text-truncate" style={{maxWidth: '350px'}}>{evt.description}</p>
                        </div>
                        <Link to={`/evento/${evt.id}`} className="btn btn-light rounded-circle btn-sm ms-2"><FaArrowRight /></Link>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                  <p className="text-muted mb-0">Nenhum evento próximo agendado.</p>
              </div>
            )}
          </Col>

          {/* Coluna da Direita: Pedidos Recentes */}
          <Col lg={5}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-secondary mb-0"><FaPray className="me-2"/> Mural de Oração</h4>
            </div>

            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-0">
                {recentOracoes.length > 0 ? (
                  <div>
                    {recentOracoes.map((ora, idx) => (
                      <div key={ora.id} className={`p-3 ${idx !== recentOracoes.length - 1 ? 'border-bottom' : ''}`}>
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-success">{ora.nome}</span>
                          <small className="text-muted" style={{fontSize: '0.7rem'}}>
                            {new Date(ora.data).toLocaleDateString('pt-BR')}
                          </small>
                        </div>
                        <p className="mb-0 text-muted small fst-italic">"{ora.pedido}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-5 mb-0">Nenhum pedido recente.</p>
                )}
                <div className="p-3 bg-light border-top text-center">
                  <Link to="/oracao" className="btn btn-outline-success btn-sm w-100 fw-bold">
                    <FaPlus className="me-1"/> Deixar meu pedido
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;