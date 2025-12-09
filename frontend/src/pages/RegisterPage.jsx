import { useState } from "react";
import { Card, Form, Button, Container, Col, Alert } from "react-bootstrap";
import apiService from "../services/api";

const RegisterPage = () => {
  // 1. Adicionamos 'role' ao estado inicial com valor padrão 'membro'
  const [formData, setFormData] = useState({ 
    nome: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: "membro" 
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      // 2. Passamos o 'role' para a função de registro
      await apiService.register(formData.nome, formData.email, formData.password, formData.role);
      
      alert("Usuário cadastrado com sucesso!");
      
      // Limpa o formulário
      setFormData({ nome: "", email: "", password: "", confirmPassword: "", role: "membro" });
      
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Col md={6}>
        <Card className="shadow border-0">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4 fw-bold text-primary">Cadastrar Novo Usuário</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
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

              {/* 3. Novo Campo: Tipo de Permissão */}
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Permissão</Form.Label>
                <Form.Select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange}
                >
                    <option value="membro">Membro (Padrão)</option>
                    <option value="operador">Operador (Edita Eventos/Mural)</option>
                    <option value="admin">Administrador (Acesso Total)</option>
                </Form.Select>
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
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default RegisterPage;