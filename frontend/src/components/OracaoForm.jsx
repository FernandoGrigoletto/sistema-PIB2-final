import { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaPaperPlane, FaUser, FaEnvelope } from 'react-icons/fa';

const OracaoForm = ({ onSave }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); // Opcional, caso queira contato
  const [pedido, setPedido] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const oracaoData = {
      nome: anonimo ? 'Anônimo' : nome,
      email: anonimo ? '' : email,
      pedido,
      data: new Date().toISOString(),
      status: 'pendente' // Status inicial
    };

    onSave(oracaoData);
    
    // Limpar formulário após envio
    setNome('');
    setEmail('');
    setPedido('');
    setAnonimo(false);
    setValidated(false);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      
      <Row className="g-3">
        {/* Checkbox de Anônimo */}
        <Col xs={12} className="d-flex justify-content-end">
           <Form.Check 
            type="switch"
            id="anonimo-switch"
            label="Quero fazer um pedido anônimo"
            checked={anonimo}
            onChange={(e) => setAnonimo(e.target.checked)}
            className="text-muted"
          />
        </Col>

        {/* Campo Nome */}
        <Col md={anonimo ? 12 : 6}>
          <Form.Group controlId="formNome">
            <Form.Label className="fw-bold text-secondary small text-uppercase">Seu Nome</Form.Label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white text-muted border-end-0"><FaUser /></span>
              <Form.Control
                type="text"
                placeholder={anonimo ? "Anônimo" : "Digite seu nome"}
                value={anonimo ? '' : nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={anonimo}
                required={!anonimo}
                className="border-start-0 bg-light"
                style={{ fontSize: '1.1rem' }}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, informe seu nome.
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>

        {/* Campo Email (Escondido se for anônimo para simplificar) */}
        {!anonimo && (
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label className="fw-bold text-secondary small text-uppercase">Seu Contato (Opcional)</Form.Label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-muted border-end-0"><FaEnvelope /></span>
                <Form.Control
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-start-0 bg-light"
                  style={{ fontSize: '1.1rem' }}
                />
              </div>
            </Form.Group>
          </Col>
        )}

        {/* Campo Pedido - O PRINCIPAL (Aumentado) */}
        <Col xs={12}>
          <Form.Group controlId="formPedido" className="mt-2">
            <Form.Label className="fw-bold text-secondary small text-uppercase">Sua Oração</Form.Label>
            <Form.Control
              as="textarea"
              rows={8} // Aumentado para 8 linhas
              placeholder="Escreva aqui seu pedido de oração, agradecimento ou desabafo..."
              value={pedido}
              onChange={(e) => setPedido(e.target.value)}
              required
              size="lg" // Fonte maior
              className="bg-light shadow-sm"
              style={{ resize: 'none', lineHeight: '1.6' }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, escreva seu pedido.
            </Form.Control.Feedback>
            <Form.Text className="text-muted text-end d-block mt-1">
              Deus ouve cada palavra.
            </Form.Text>
          </Form.Group>
        </Col>

        {/* Botão de Envio */}
        <Col xs={12} className="mt-4">
          <Button 
            type="submit" 
            variant="success" 
            size="lg" 
            className="w-100 fw-bold py-3 shadow-sm hover-scale"
            style={{ 
              background: 'linear-gradient(45deg, #198754, #20c997)', 
              border: 'none',
              fontSize: '1.2rem',
              letterSpacing: '1px'
            }}
          >
            <FaPaperPlane className="me-2" /> ENVIAR PEDIDO DE ORAÇÃO
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default OracaoForm;