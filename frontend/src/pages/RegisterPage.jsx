import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import apiService from "../services/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nome: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      alert("Cadastro realizado com sucesso! Faça login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Col md={5}>
        <Card className="shadow border-0">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4 fw-bold text-primary">Criar Conta</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control type="text" name="nome" required onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" required onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" name="password" required onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control type="password" name="confirmPassword" required onChange={handleChange} />
              </Form.Group>

              <Button type="submit" className="w-100 btn-primary" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>Já tem uma conta? <Link to="/login" className="fw-bold">Faça Login</Link></small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default RegisterPage;