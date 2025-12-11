import { useState, useEffect } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";

function MembroFiltro({ onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState({
    nome: "",
    cidade: "",
    status: "",
    genero: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Atualiza estado local
    setLocalFilters((prev) => {
      const novosFiltros = { ...prev, [name]: value };
      
      // Envia IMEDIATAMENTE para o pai filtrar
      if (onFiltersChange) {
        onFiltersChange(novosFiltros);
      }
      return novosFiltros;
    });
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body className="bg-light rounded">
        <Row className="g-3">
          <Col md={4}>
            <Form.Control name="nome" placeholder="Buscar por Nome..." value={localFilters.nome} onChange={handleInputChange} />
          </Col>
          <Col md={3}>
            <Form.Control name="cidade" placeholder="Cidade..." value={localFilters.cidade} onChange={handleInputChange} />
          </Col>
          <Col md={2}>
            <Form.Select name="status" value={localFilters.status} onChange={handleInputChange}>
              <option value="">Status (Todos)</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Visitante">Visitante</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="genero" value={localFilters.genero} onChange={handleInputChange}>
              <option value="">Gênero (Todos)</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Form.Select>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default MembroFiltro;
