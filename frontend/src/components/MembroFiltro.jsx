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

  const handleInputChange = (mem) => {
    const { name, value } = mem.target;
    setMembroFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aplicarFiltros = async () => {
    try {
      // Chama o serviço passando os filtros atuais
      const data = await membroService.getAll(membroFilters);

      if (onFiltersChange) {
        onFiltersChange(data);
      }
      console.log("Dados filtrados: ", data);
    } catch (error) {
      console.error("Erro ao filtrar:", error);
    }
  };

  // Aplica filtros automaticamente sempre que um campo muda
  useEffect(() => {
    // Debounce opcional: você pode adicionar um setTimeout aqui se quiser evitar muitas chamadas
    aplicarFiltros();
  }, [membroFilters]);

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold text-primary">Filtros de Pesquisa</h5>
      </Card.Header>

      <Card.Body>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-muted small fw-bold">Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                placeholder="Buscar por nome..."
                value={membroFilters.nome}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="text-muted small fw-bold">Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                placeholder="Cidade..."
                value={membroFilters.cidade}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label className="text-muted small fw-bold">Status</Form.Label>
              <Form.Select
                name="status"
                value={membroFilters.status}
                onChange={handleInputChange}
              >
                <option value="">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Ausente">Ausente</option>
                <option value="Visitante">Visitante</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="text-muted small fw-bold">Gênero</Form.Label>
              <Form.Select
                name="genero"
                value={membroFilters.genero}
                onChange={handleInputChange}
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
