import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaPray, 
  FaArrowRight, 
  FaImage, 
  FaFacebook,
  FaInstagram,
  FaHandHoldingHeart,
  FaQrcode,
  FaImages
} from "react-icons/fa";

import bannerImage from '../assets/banner-home.jpg';
import eventoService from "../services/eventoService";

const Home = () => {
  const [nextEvents, setNextEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const eventosData = await eventoService.getAll();
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
                {/* MUDANÇA AQUI: De success (verde) para primary (azul) */}
                <div className="icon-circle bg-primary bg-opacity-10 text-primary mb-3">
                  <FaPray size={28} />
                </div>
                <Card.Title className="fw-bold">Pedidos de Oração</Card.Title>
                <Card.Text className="text-muted small mb-4">
                  Um espaço para intercedermos uns pelos outros.
                </Card.Text>
                <Button as={Link} to="/oracao" variant="outline-primary" className="mt-auto w-100 rounded-pill fw-bold">
                  Deixar Pedido
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Seção de Conteúdo: Eventos */}
      <Container className="py-5 mt-4">
        <Row className="g-5 justify-content-center">
          <Col lg={10}>
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
                        <p className="text-muted small mb-0 text-truncate" style={{maxWidth: '100%'}}>{evt.description}</p>
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
        </Row>
      </Container>

      {/* --- SEÇÃO DÍZIMOS E OFERTAS (AGORA AZUL) --- */}
      <section className="bg-white py-5 my-4 shadow-sm border-top border-bottom">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={7}>
              {/* Ícone e Título em Azul */}
              <div className="d-flex align-items-center gap-3 mb-3 text-primary">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FaHandHoldingHeart size={32} />
                </div>
                <h2 className="fw-bold mb-0 text-dark">Dízimos e Ofertas</h2>
              </div>
              
              <p className="lead text-muted mb-4">
                "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria."
                <br/>
                {/* Referência Bíblica em Azul */}
                <small className="fst-italic text-primary fw-bold">- 2 Coríntios 9:7</small>
              </p>

              {/* Box de Dados Bancários em Azul */}
              <div className="p-4 bg-light rounded-3 border-start border-4 border-primary">
                <h5 className="fw-bold text-dark mb-2">Dados para Contribuição (PIX):</h5>
                <p className="font-monospace fs-4 mb-1 text-primary fw-bold">CNPJ: 53.341.459/0001-15</p>
                <p className="text-muted mb-0 small">
                  Banco Santander | Agência: 0177 | Conta: 13005652-5 <br/>
                  Primeira Igreja Batista em Osvaldo Cruz
                </p>
              </div>
            </Col>
            <Col md={5} className="text-center">
              <div className="d-inline-block p-3 border rounded-4 bg-white shadow">
                <div className="mb-2 bg-light d-flex align-items-center justify-content-center rounded" style={{width: '250px', height: '250px', overflow: 'hidden'}}>
                  <img 
                    src="/qrcode-pix.jpg" 
                    alt="QR Code PIX" 
                    className="img-fluid"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="https://placehold.co/250x250/png?text=QR+Code+PIX"; 
                    }}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2 text-muted fw-bold small">
                   <FaQrcode /> Escaneie para doar
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- SEÇÃO: GALERIA DE FOTOS --- */}
      <section className="py-5 position-relative overflow-hidden text-white mb-5">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        ></div>
        
        <Container className="position-relative z-1 text-center py-4">
          <div className="d-inline-block p-3 rounded-circle border border-2 border-white mb-3 text-white">
            <FaImages size={32} />
          </div>
          <h2 className="display-6 fw-bold mb-3">Galeria de Fotos</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            Reviva os momentos especiais da nossa comunidade. Confira as fotos dos nossos cultos, eventos e celebrações.
          </p>
          
          <Button 
            href="https://drive.google.com/drive/folders/SEU_CODIGO_DO_DRIVE_AQUI" 
            target="_blank"
            rel="noopener noreferrer"
            variant="light" 
            size="lg" 
            className="rounded-pill px-5 fw-bold text-dark shadow-lg"
          >
            Acessar Galeria Completa
          </Button>
        </Container>
      </section>

      {/* --- SEÇÃO REDES SOCIAIS --- */}
      <Container className="py-5 mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-bold text-dark m-0 border-start border-4 border-primary ps-3">
            Nossas Redes Sociais
          </h3>
        </div>

        <Row className="g-4 justify-content-center">
          
          <Col md={6}>
            <Card className="border-0 shadow-lg bg-white h-100" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-4 d-flex flex-column align-items-center">
                <div className="d-flex align-items-center gap-2 mb-3 text-primary">
                  <FaFacebook size={32} />
                  <h4 className="fw-bold mb-0">Facebook</h4>
                </div>
                
                <div className="bg-light p-2 rounded shadow-sm w-100" style={{ maxWidth: '500px' }}>
                  <div style={{ overflow: 'hidden', width: '100%' }}>
                    <iframe 
                      src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpibosvaldocruz&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                      width="100%"
                      height="500" 
                      style={{border: 'none', overflow: 'hidden', display: 'block'}} 
                      scrolling="no" 
                      frameBorder="0" 
                      allowFullScreen={true} 
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      title="Facebook PIB Osvaldo Cruz"
                    ></iframe>
                  </div>
                </div>
                
                <a 
                  href="https://www.facebook.com/pibosvaldocruz/?locale=pt_BR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-100 mt-3 fw-bold rounded-pill"
                >
                  Visitar Página no Facebook
                </a>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-lg bg-white h-100" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
                <div className="d-flex align-items-center gap-2 mb-3" style={{ color: '#E1306C' }}>
                  <FaInstagram size={32} />
                  <h4 className="fw-bold mb-0">Instagram</h4>
                </div>
                
                <div className="my-4">
                  <div className="rounded-circle p-1 d-inline-block mb-3" style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'}}>
                     <div className="bg-white rounded-circle p-1">
                        <img src="/logo-igreja.jpg" alt="Insta" className="rounded-circle" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                     </div>
                  </div>
                  <h5 className="fw-bold">@pibocruz</h5>
                  <p className="text-muted small">Acompanhe nossas fotos, stories e momentos especiais.</p>
                </div>

                <a 
                  href="https://www.instagram.com/pibocruz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn text-white w-100 mt-auto fw-bold rounded-pill"
                  style={{ background: 'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)' }}
                >
                  Seguir no Instagram
                </a>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>

    </div>
  );
};

export default Home;