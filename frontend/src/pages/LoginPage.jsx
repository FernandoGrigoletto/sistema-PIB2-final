import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Hook personalizado
import { Navigate, Link } from "react-router-dom";
import { Container, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa"; // Ícones opcionais

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();

  // Se o usuário já estiver logado, redireciona para a Home
  if (isAuthenticated && !loading) {
    return <Navigate to='/' replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao tentar conectar. Verifique o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Col md={5} lg={4}>
        <Card className="shadow border-0 rounded-3">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary">Bem-vindo</h3>
              <p className="text-muted small">Insira suas credenciais para acessar</p>
            </div>

            {error && <Alert variant="danger" className="text-center py-2 small">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="lg"
                  className="fs-6"
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="lg"
                  className="fs-6"
                />
              </Form.Group>

              {/* Link de "Esqueceu a senha?" adicionado aqui */}
              <div className="text-end mb-4">
                <Link to="/forgot-password" className="text-decoration-none small text-muted">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 btn-lg mb-3 d-flex align-items-center justify-content-center gap-2" 
                disabled={loading}
              >
                {loading ? 'Acessando...' : <><FaSignInAlt /> Entrar</>}
              </Button>
            </Form>

            <div className="text-center border-top pt-3 mt-3">
              <small className="text-muted">
                Não possui uma conta? <br/>
                <Link to="/register" className="text-decoration-none fw-bold d-inline-flex align-items-center gap-1">
                  <FaUserPlus size={12} /> Cadastre-se aqui
                </Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}

export default LoginPage;