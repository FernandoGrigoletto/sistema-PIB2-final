import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaPray, FaMoneyBillWave, FaArrowRight } from "react-icons/fa";

// Services
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
        // Carrega dados em paralelo
        const [oracoesData, eventosData] = await Promise.all([
          oracaoService.getAll(),
          eventoService.getAll()
        ]);

        // Pega as 3 últimas orações
        setRecentOracoes(oracoesData.slice(0, 3));

        // Filtra eventos futuros e pega os 2 próximos
        const today = new Date().toISOString().split('T')[0];
        const upcoming = eventosData
          .filter(e => e.brand >= today)
          .sort((a, b) => new Date(a.brand) - new Date(b.brand))
          .slice(0, 2);
        
        setNextEvents(upcoming);

      } catch (error) {
        console.error("Erro ao carregar dados da home:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Seção de Boas-vindas */}
      <div className="mb-5 p-5 bg-primary text-white rounded shadow-sm position-relative overflow-hidden">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="display-4 fw-bold">Bem-vindo!</h1>
          <p className="lead">Sistema de Gestão - PIB</p>
          <p className="mb-0 opacity-75">"Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles." (Mateus 18:20)</p>
        </div>
        {/* Elemento decorativo de fundo (opcional) */}
        <div style={{
            position: 'absolute', top: '-20%', right: '-10%', fontSize: '15rem', opacity: '0.1', transform: 'rotate(-20deg)'
        }}>
            <FaPray />
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="bg-light p-3 rounded-circle mb-3 text-primary">
                <FaCalendarAlt size={30} />
              </div>
              <Card.Title>Eventos</Card.Title>
              <Card.Text className="text-muted small">
                Gerencie cultos, festas e reuniões da igreja.
              </Card.Text>
              <Button as={Link} to="/eventos" variant="outline-primary" className="mt-auto w-100">
                Ver Agenda
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="bg-light p-3 rounded-circle mb-3 text-success">
                <FaPray size={30} />
              </div>
              <Card.Title>Orações</Card.Title>
              <Card.Text className="text-muted small">
                Acompanhe os pedidos de oração dos membros.
              </Card.Text>
              <Button as={Link} to="/oracao" variant="outline-success" className="mt-auto w-100">
                Pedidos de Oração
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
              <div className="bg-light p-3 rounded-circle mb-3 text-warning">
                <FaMoneyBillWave size={30} />
              </div>
              <Card.Title>Financeiro</Card.Title>
              <Card.Text className="text-muted small">
                Fluxo de caixa, Entradas e Saídas.
              </Card.Text>
              <Button as={Link} to="/fluxo-caixa" variant="outline-warning" className="mt-auto w-100">
                Abrir Caixa
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Coluna da Esquerda: Próximos Eventos */}
        <Col lg={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-secondary"><FaCalendarAlt className="me-2"/> Próximos Eventos</h5>
              <Link to="/eventos" className="text-decoration-none small">Ver todos</Link>
            </Card.Header>
            <Card.Body>
              {nextEvents.length > 0 ? (
                nextEvents.map((evt) => (
                  <div key={evt.id} className="d-flex border-bottom py-3 align-items-center">
                    <div className="text-center me-3 bg-light rounded p-2 border" style={{minWidth: '60px'}}>
                      <span className="d-block fw-bold h5 mb-0 text-primary">
                        {new Date(evt.brand).getDate()}
                      </span>
                      <span className="d-block small text-uppercase text-muted">
                        {new Date(evt.brand).toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold">{evt.description}</h6>
                      <Badge bg="info">{evt.category}</Badge>
                    </div>
                    <Button as={Link} to={`/evento/${evt.id}`} size="sm" variant="light" className="rounded-circle">
                      <FaArrowRight />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center py-4">Não há eventos próximos agendados.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna da Direita: Pedidos Recentes */}
        <Col lg={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold text-secondary"><FaPray className="me-2"/> Últimos Pedidos</h5>
            </Card.Header>
            <Card.Body>
              {recentOracoes.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {recentOracoes.map((ora) => (
                    <li key={ora.id} className="list-group-item px-0 py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <span className="fw-bold d-block">{ora.nome}</span>
                          <small className="text-muted text-truncate d-block" style={{maxWidth: '250px'}}>
                            "{ora.pedido}"
                          </small>
                        </div>
                        <small className="text-muted ms-2" style={{fontSize: '0.75rem'}}>
                          {new Date(ora.data).toLocaleDateString('pt-BR')}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center py-4">Nenhum pedido recente.</p>
              )}
              <div className="mt-3">
                <Button as={Link} to="/oracao" variant="outline-primary" size="sm" className="w-100">
                  Fazer novo pedido
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

