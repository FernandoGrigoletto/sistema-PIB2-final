import { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { FaSearch, FaEraser } from "react-icons/fa";

const MembroFiltro = ({ onFilterChange }) => {
  const [filtros, setFiltros] = useState({
    nome: "",
    cidade: ""
  });

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filtros); // Envia os filtros para o componente Pai (Membros.jsx)
  };

  const handleClear = () => {
    const reset = { nome: "", cidade: "" };
    setFiltros(reset);
    onFilterChange(reset); // Limpa e recarrega tudo
  };

  return (
    <Card className="mb-4 shadow-sm border-0 bg-light">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-end g-3">
            <Col md={5}>
              <Form.Group>
                <Form.Label className="text-muted small fw-bold">Buscar por Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  placeholder="Ex: João Silva"
                  value={filtros.nome}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-muted small fw-bold">Buscar por Cidade</Form.Label>
                <Form.Control
                  type="text"
                  name="cidade"
                  placeholder="Ex: São Paulo"
                  value={filtros.cidade}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={3} className="d-flex gap-2">
              <Button variant="primary" type="submit" className="w-100 d-flex align-items-center justify-content-center gap-2">
                <FaSearch /> Filtrar
              </Button>
              <Button variant="outline-secondary" onClick={handleClear} title="Limpar filtros">
                <FaEraser />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MembroFiltro;