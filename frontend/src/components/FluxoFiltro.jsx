import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const FluxoFiltro = ({ categorias, onFilter }) => {
  // Data atual e 30 dias antes
  const hoje = new Date();
  const trintaDiasAntes = new Date();
  trintaDiasAntes.setDate(hoje.getDate() - 30);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [tipo, setTipo] = useState("todos");
  const [categoria, setCategoria] = useState("todos");
  const [dataInicio, setDataInicio] = useState(formatDate(trintaDiasAntes));
  const [dataFim, setDataFim] = useState(formatDate(hoje));

  useEffect(() => {
    // Aplica o filtro inicial automaticamente
    onFilter({
      tipo,
      categoria,
      dataInicio,
      dataFim,
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      tipo,
      categoria,
      dataInicio,
      dataFim,
    });
  };

  const handleReset = () => {
    setTipo("todos");
    setCategoria("todos");
    setDataInicio(formatDate(trintaDiasAntes));
    setDataFim(formatDate(hoje));
    onFilter({
      tipo: "todos",
      categoria: "todos",
      dataInicio: formatDate(trintaDiasAntes),
      dataFim: formatDate(hoje),
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3 p-3 border rounded shadow-sm bg-light">
      <Row className="align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="todos">Todos</option>
              {categorias.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group>
            <Form.Label>Data Início</Form.Label>
            <Form.Control
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group>
            <Form.Label>Data Fim</Form.Label>
            <Form.Control
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={2} className="d-flex gap-2">
          <Button variant="primary" type="submit">
            Filtrar
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Limpar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FluxoFiltro;
