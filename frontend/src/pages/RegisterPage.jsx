import { useState } from "react";
// Removemos o Link, pois o admin não precisa ir para login
import { Card, Form, Button, Container, Col, Alert } from "react-bootstrap";
import apiService from "../services/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nome: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // navigate não é estritamente necessário se formos apenas limpar o form, 
  // mas você pode usar para voltar à Home se quiser.

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("As senhas não conferem");
    }

    setLoading(true);
    try {
      await apiService.register(formData.nome, formData.email, formData.password);
      
      // ALTERAÇÃO: Mensagem adequada para o admin
      alert("Usuário cadastrado com sucesso!");
      
      // ALTERAÇÃO: Limpar o formulário para permitir novo cadastro
      setFormData({ nome: "", email: "", password: "", confirmPassword: "" });
      
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Col md={6}> {/* Aumentei um pouco a largura para md=6 */}
        <Card className="shadow border-0">
          <Card.Body className="p-5">
            {/* ALTERAÇÃO: Título mais adequado */}
            <h2 className="text-center mb-4 fw-bold text-primary">Cadastrar Novo Usuário</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control 
                    type="text" 
                    name="nome" 
                    value={formData.nome} // Importante: vincular ao estado para limpar depois
                    required 
                    onChange={handleChange} 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    required 
                    onChange={handleChange} 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control 
                    type="password" 
                    name="password" 
                    value={formData.password}
                    required 
                    onChange={handleChange} 
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    required 
                    onChange={handleChange} 
                />
              </Form.Group>

              <Button type="submit" className="w-100 btn-primary" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar Usuário"}
              </Button>
            </Form>

            {/* ALTERAÇÃO: Link de "Já tem conta" removido */}
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default RegisterPage;