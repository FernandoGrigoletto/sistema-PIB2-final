import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUserPlus, FaCheckSquare } from 'react-icons/fa';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'operador' // Padrão operador, mas pode ser admin
  });
  
  // Estado para as permissões
  const [permissions, setPermissions] = useState({
    oracoes: true,
    fluxo_caixa: false,
    eventos: true,
    pedidos_oracao_admin: false // Acesso à lista administrativa
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (e) => {
    setPermissions({ ...permissions, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Se for admin, forçamos todas as permissões como true (opcional)
      const finalPermissions = formData.role === 'admin' 
        ? { oracoes: true, fluxo_caixa: true, eventos: true, pedidos_oracao_admin: true } 
        : permissions;

      await apiService.register(
        formData.nome, 
        formData.email, 
        formData.password, 
        formData.role,
        finalPermissions
      );

      setSuccess('Usuário cadastrado com sucesso!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FaUserPlus size={32} className="text-primary" />
                </div>
                <h2 className="fw-bold">Novo Usuário</h2>
                <p className="text-muted">Cadastre um membro da equipe e defina acessos.</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required 
                    placeholder="Ex: João Silva"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="email@igreja.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha Provisória</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Tipo de Usuário</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="operador">Operador (Acesso personalizado)</option>
                    <option value="admin">Administrador (Acesso total)</option>
                  </Form.Select>
                </Form.Group>

                {/* Seção de Permissões (Só mostra se não for Admin) */}
                {formData.role !== 'admin' && (
                  <div className="bg-light p-3 rounded-3 mb-4 border">
                    <h6 className="d-flex align-items-center gap-2 mb-3 text-secondary">
                      <FaCheckSquare /> Permissões de Acesso
                    </h6>
                    
                    <Form.Check 
                      type="switch"
                      id="perm-eventos"
                      label="Gerenciar Eventos"
                      name="eventos"
                      checked={permissions.eventos}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />
                    
                    <Form.Check 
                      type="switch"
                      id="perm-oracoes"
                      label="Visualizar Lista de Orações (Admin)"
                      name="pedidos_oracao_admin"
                      checked={permissions.pedidos_oracao_admin}
                      onChange={handlePermissionChange}
                      className="mb-2"
                    />

                    <Form.Check 
                      type="switch"
                      id="perm-fluxo"
                      label="Acessar Fluxo de Caixa"
                      name="fluxo_caixa"
                      checked={permissions.fluxo_caixa}
                      onChange={handlePermissionChange}
                    />
                  </div>
                )}

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold rounded-pill">
                  Cadastrar Usuário
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;