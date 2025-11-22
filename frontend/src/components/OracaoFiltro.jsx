import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import oracaoService from "../services/oracaoService";

function OracaoFiltro({ onFiltersChange }) {
  const [oracaoFilters, setOracaoFilters] = useState({
    data: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOracaoFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aplicarFiltros = async () => {
    try {
      const data = await oracaoService.getAll(oracaoFilters);
      if (onFiltersChange) {
        onFiltersChange(data);
      }
      console.log("Dados filtrados:", data);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Filtrar Orações por Data</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group controlId="filtroData">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  name="data"
                  value={oracaoFilters.data}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button variant="primary" onClick={aplicarFiltros}>
                Aplicar Filtro
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default OracaoFiltro;