import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaPray, 
  FaArrowRight, 
  FaImage, 
  FaPlus,
  FaFacebook
} from "react-icons/fa";

import bannerImage from '../assets/banner-home.jpg';
import oracaoService from "../services/oracaoService";
import eventoService from "../services/eventoService";

const Home = () => {
  const [recentOracoes, setRecentOracoes] = useState([]);
  const [nextEvents, setNextEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [oracoesData, eventosData] = await Promise.all([
          oracaoService.getAll(),
          eventoService.getAll()
        ]);

        setRecentOracoes(oracoesData.slice(0, 3));

        const today = new Date().toISOString().split('T')[0];
        const upcoming = eventosData
          .filter(e => e.brand >= today)
          .sort((a, b) => new Date(a.brand) - new Date(b.brand))
          .slice(0, 3);
        
        setNextEvents(upcoming);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <div className="home-page bg-light">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `url(${bannerImage})` }}></div>
        <div className="hero-overlay"></div>
        <Container className="position-relative z-2 text-center text-white h-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="display-3 fw-bold mb-3 hero-title">Primeira Igreja Batista em Osvaldo Cruz - SP</h1>
          <p className="lead fs-4 mb-4 hero-subtitle">Igreja, o lugar aonde pessoas imperfeitas descobrem que ninguém é perfeito aqui na terra,<br/>mas também aprendem que o amor pode superar essas imperfeições.</p>
        </Container>
      </section>

      {/* Cards de Acesso Rápido */}
      <Container className="cards-container">
        <Row className="g-4 justify-content-center">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-lg feature-card text-center">
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="icon-circle bg-primary bg-opacity-10 text-primary mb-3">
                  <FaCalendarAlt size={28} />
                </div>
                <Card.Title className="fw-bold">Agenda</Card.Title>
                <Card.Text className="text-muted small mb-4">
                  Confira os horários dos cultos e eventos especiais.
                </Card.Text>
                <Button as={Link} to="/eventos" variant="outline-primary" className="mt-auto w-100 rounded-pill fw-bold">
                  Ver Programação
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 shadow-lg feature-card text-center">
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="icon-circle bg-success bg-opacity-10 text-success mb-3">
                  <FaPray size={28} />
                </div>
                <Card.Title className="fw-bold">Pedidos de Oração</Card.Title>
                <Card.Text className="text-muted small mb-4">
                  Um espaço para intercedermos uns pelos outros.
                </Card.Text>
                <Button as={Link} to="/oracao" variant="outline-success" className="mt-auto w-100 rounded-pill fw-bold">
                  Deixar Pedido
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Seção de Conteúdo: Eventos e Mural */}
      <Container className="py-5 mt-4">
        <Row className="g-5">
          {/* Lista de Eventos */}
          <Col lg={7}>
             <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fw-bold text-dark m-0 border-start border-4 border-primary ps-3">Próximos Eventos</h3>
              <Link to="/eventos" className="text-primary fw-bold text-decoration-none small">Ver todos →</Link>
            </div>
            {nextEvents.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {nextEvents.map((evt) => (
                  <Card key={evt.id} className="border-0 shadow-sm event-row overflow-hidden">
                    <Card.Body className="p-0 d-flex align-items-stretch">
                      <div className="date-box bg-primary text-white d-flex flex-column justify-content-center align-items-center p-3" style={{minWidth: '85px'}}>
                        <span className="h3 fw-bold mb-0">{new Date(evt.brand).getDate()}</span>
                        <span className="small text-uppercase">{new Date(evt.brand).toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}</span>
                      </div>
                      <div className="p-3 flex-grow-1 d-flex flex-column justify-content-center">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Badge bg="light" text="dark" className="border">{evt.category}</Badge>
                          {evt.arquivo && <FaImage className="text-muted" size={12} />}
                        </div>
                        <h5 className="fw-bold text-dark mb-1">{evt.titulo || "Evento"}</h5>
                        <p className="text-muted small mb-0 text-truncate" style={{maxWidth: '400px'}}>{evt.description}</p>
                      </div>
                      <div className="d-flex align-items-center pe-3">
                         <Link to={`/evento/${evt.id}`} className="btn btn-light btn-sm rounded-circle shadow-sm"><FaArrowRight /></Link>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-5 bg-white rounded border border-dashed">
                <p className="text-muted mb-0">Nenhum evento agendado.</p>
              </div>
            )}
          </Col>

          {/* Mural de Oração */}
          <Col lg={5}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fw-bold text-dark m-0 border-start border-4 border-success ps-3">Mural de Oração</h3>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                {recentOracoes.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentOracoes.map((ora) => (
                      <div key={ora.id} className="list-group-item p-3 border-0 border-bottom">
                        <div className="d-flex justify-content-between mb-1">
                          <strong className="text-success">{ora.nome}</strong>
                          <span className="text-muted x-small">{new Date(ora.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="mb-0 text-secondary small fst-italic">"{ora.pedido}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted mb-0">Nenhum pedido recente.</p>
                  </div>
                )}
                <div className="p-3 bg-light">
                  <Link to="/oracao" className="btn btn-success w-100 btn-sm fw-bold shadow-sm">
                    <FaPlus className="me-1"/> Deixar meu pedido
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* --- SEÇÃO FACEBOOK AJUSTADA (QUADRO) --- */}
      <Container className="py-5 mb-5">
        <Row className="justify-content-center">
          {/* Limitamos a largura para criar o efeito de destaque centralizado */}
          <Col md={10} lg={8} xl={6}>
            
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fw-bold text-dark m-0 border-start border-4 border-primary ps-3">
                Acompanhe no Facebook
              </h3>
              <a 
                href="https://www.facebook.com/pibosvaldocruz/?locale=pt_BR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm fw-bold"
              >
                <FaFacebook className="me-2"/> Visitar Página
              </a>
            </div>
            
            {/* O "Quadro" Externo */}
            <Card className="border-0 shadow-lg bg-light" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-3 text-center">
                
                {/* A "Moldura" Interna Branca */}
                <div className="bg-white p-2 rounded shadow-sm d-inline-block" style={{ maxWidth: '100%' }}>
                  <div style={{ overflow: 'hidden', maxWidth: '500px', margin: '0 auto' }}>
                    <iframe 
                      src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpibosvaldocruz&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                      width="100%"
                      height="600" 
                      style={{border: 'none', overflow: 'hidden', display: 'block'}} 
                      scrolling="no" 
                      frameBorder="0" 
                      allowFullScreen={true} 
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      title="Facebook PIB Osvaldo Cruz"
                    ></iframe>
                  </div>
                </div>

                <div className="mt-3 text-muted small fst-italic">
                  <FaArrowRight className="me-1 text-primary" size={10} />
                  Role dentro do quadro para ver postagens antigas.
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