import { Container, Accordion, Badge, Card, Row, Col } from "react-bootstrap";
import { FaQuestionCircle, FaCalendarAlt, FaPray, FaMoneyBillWave, FaUserLock } from "react-icons/fa";

const Help = () => {
  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
            <FaQuestionCircle size={32} />
        </div>
        <div>
            <h2 className="mb-0 fw-bold text-secondary">Ajuda e Suporte</h2>
            <span className="text-muted">Manuais e perguntas frequentes sobre o sistema.</span>
        </div>
      </div>

      <Accordion defaultActiveKey="0" className="shadow-sm rounded">
        
        {/* Módulo de Eventos */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <FaCalendarAlt className="me-2 text-primary" /> 
            <strong>Agenda e Eventos</strong>
          </Accordion.Header>
          <Accordion.Body>
            <h5>Visualização Pública</h5>
            <p>Qualquer utilizador pode visualizar os eventos na página inicial ou na aba "Eventos". Utilize o campo de pesquisa para filtrar por título ou categoria.</p>
            
            <hr />
            <h5>Gestão (Administradores/Operadores)</h5>
            <ul>
                <li><strong>Criar:</strong> Clique no botão "Novo Evento", preencha o título, descrição, data e anexe uma imagem ou vídeo.</li>
                <li><strong>Editar/Excluir:</strong> Nos cartões dos eventos, utilize os ícones de lápis ou lixeira para gerir o conteúdo.</li>
                <li><strong>Categorias:</strong> Os eventos são classificados como Culto, Festa, Reunião ou Outros.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* Módulo de Oração */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <FaPray className="me-2 text-success" /> 
            <strong>Mural de Oração</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>O Mural de Oração permite que membros partilhem pedidos para intercessão.</p>
            <ul>
                <li><strong>Fazer um Pedido:</strong> Clique em "Fazer Pedido", insira o seu nome, contacto (opcional para o público) e o motivo da oração.</li>
                <li><strong>Privacidade:</strong> O número de contacto só é visível para Administradores do sistema.</li>
                <li><strong>Administração:</strong> Administradores podem remover pedidos antigos ou impróprios clicando em "Remover".</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* Módulo Financeiro */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <FaMoneyBillWave className="me-2 text-warning" /> 
            <strong>Fluxo de Caixa (Restrito)</strong>
          </Accordion.Header>
          <Accordion.Body>
            <Badge bg="danger" className="mb-2">Apenas Admin e Operador</Badge>
            <p>Este módulo gere as finanças da igreja.</p>
            <ul>
                <li><strong>Dashboard:</strong> Visualize o total de Entradas, Saídas e o Saldo Atual no topo da página.</li>
                <li><strong>Lançamentos:</strong> Registe Dízimos, Ofertas ou Despesas.</li>
                <li><strong>Relatórios:</strong>
                    <ul>
                        <li><span className="fw-bold">Excel:</span> Descarrega uma folha de cálculo com os dados filtrados.</li>
                        <li><span className="fw-bold">Imprimir:</span> Gera uma versão limpa da página para impressão física.</li>
                    </ul>
                </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* Contas e Acessos */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <FaUserLock className="me-2 text-secondary" /> 
            <strong>Contas e Permissões</strong>
          </Accordion.Header>
          <Accordion.Body>
            <p>O sistema possui diferentes níveis de acesso:</p>
            <Row className="g-3 mt-2">
                <Col md={4}>
                    <Card className="h-100 border-light bg-light">
                        <Card.Body>
                            <h6 className="fw-bold">Visitante</h6>
                            <small>Apenas visualiza eventos e pedidos de oração. Pode criar novos pedidos de oração.</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 border-light bg-light">
                        <Card.Body>
                            <h6 className="fw-bold text-primary">Membro</h6>
                            <small>Acesso básico ao sistema após login.</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 border-light bg-light">
                        <Card.Body>
                            <h6 className="fw-bold text-danger">Admin/Operador</h6>
                            <small>Acesso total ao Fluxo de Caixa, gestão de Eventos e gestão de Utilizadores.</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <p className="mt-3 text-muted small">
                * Para criar um novo utilizador administrativo, solicite ao Administrador Principal através da aba "Novo Usuário".
            </p>
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>

      <div className="text-center mt-5 text-muted">
        <small>Sistema PIB - Versão 1.0.0</small>
      </div>
    </Container>
  );
};

export default Help;