import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

import membroService from "../services/membroService";

function MembroFiltro({ onFiltersChange }) {
  const [membroFilters, setMembroFilters] = useState({
    genero: "",
    status: "",
    cidade: "",
    nome: "",
  });

  // lidando com as mudancas nos inputs

  const handleInputChange = (mem) => {
    const { name, value } = mem.target;
    setMembroFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // function para aplicar filtros

  const aplicarFiltros = async () => {
    const data = await membroService.getAll(membroFilters);

    if (onFiltersChange) {
      onFiltersChange(data);
    }

    console.log("Dados filtrados: ", data);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [membroFilters]);

  return (
    <Card className="mb-5">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Filtros de Membros</h5>
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={membroFilters.nome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                value={membroFilters.cidade}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Status</Form.Label>

              <Form.Select
                name="status"
                value={membroFilters.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Ausente">Ausente</option>
                <option value="Visitante">Visitante</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Gênero</Form.Label>
              <Form.Select
                name="genero"
                value={membroFilters.genero}
                onChange={handleInputChange}
                required
              >
                <option value="">Todos</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default MembroFiltro;
