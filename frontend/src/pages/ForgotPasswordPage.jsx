import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import apiService from "../services/api";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await apiService.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
      } else {
        setError("Não foi possível processar sua solicitação.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Col md={5} lg={4}>
        <Card className="shadow border-0 rounded-3">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary">Recuperar Senha</h3>
              <p className="text-muted small">Informe seu e-mail para receber o link</p>
            </div>

            {message && <Alert variant="success" className="small">{message}</Alert>}
            {error && <Alert variant="danger" className="small">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>E-mail cadastrado</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="lg"
                />
              </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 btn-lg mb-3 d-flex align-items-center justify-content-center gap-2" 
                disabled={loading || message}
              >
                {loading ? 'Enviando...' : <><FaEnvelope /> Enviar Link</>}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none text-secondary d-inline-flex align-items-center gap-1">
                <FaArrowLeft size={12} /> Voltar para o Login
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default ForgotPasswordPage;