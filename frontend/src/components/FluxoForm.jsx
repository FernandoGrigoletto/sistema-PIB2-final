import { useState, useEffect } from "react";
import { Form, Button, Row, Col, InputGroup, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const FluxoForm = ({ onSave, fluxo, categoriasDisponiveis }) => { // Recebe categoriasDisponiveis
  const [descricao, setDescricao] = useState(fluxo?.descricao || "");
  const [valor, setValor] = useState(fluxo?.valor || "");
  const [tipo, setTipo] = useState(fluxo?.tipo || "entrada");
  const [data, setData] = useState(fluxo?.data ? new Date(fluxo.data).toISOString().split('T')[0] : "");
  
  // Inicializa com as categorias vindas do pai ou um fallback básico
  const [categorias, setCategorias] = useState(
    categoriasDisponiveis && categoriasDisponiveis.length > 0
      ? categoriasDisponiveis
      : ["Dízimo", "Doação", "Venda", "Despesa", "Outros"]
  );

  const [categoria, setCategoria] = useState(fluxo?.categoria || categorias[0]);
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCategoria, setNewCategoria] = useState("");
  
  const [errors, setErrors] = useState({});

  // Sincroniza se a lista do pai mudar (opcional, mas bom para garantir consistência)
  useEffect(() => {
    if (categoriasDisponiveis && categoriasDisponiveis.length > 0) {
        // Mantém categorias locais adicionadas recentemente se houver
        setCategorias(prev => [...new Set([...prev, ...categoriasDisponiveis])]);
    }
  }, [categoriasDisponiveis]);

  const validate = () => {
    const newErrors = {};
    if (!descricao) newErrors.descricao = "Descrição é obrigatória";
    if (!valor) newErrors.valor = "Valor é obrigatório";
    else if (valor <= 0) newErrors.valor = "Valor deve ser maior que zero";
    if (!data) newErrors.data = "Data é obrigatória";
    if (!categoria) newErrors.categoria = "Selecione uma categoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: fluxo?.id || 0,
      descricao,
      valor: parseFloat(valor),
      tipo,
      data,
      categoria, // Envia o nome da categoria (string)
    });

    // Reset campos (opcional, pois o form costuma fechar)
    setDescricao("");
    setValor("");
    setTipo("entrada");
    setData("");
    setErrors({});
  };

  const handleAddCategoria = () => {
    if (!newCategoria.trim()) return;
    if (categorias.includes(newCategoria.trim())) {
      alert("Categoria já existe!");
      return;
    }

    const nova = newCategoria.trim();
    setCategorias([...categorias, nova]);
    setCategoria(nova); // Já seleciona a nova categoria
    setNewCategoria("");
    setShowNewCatModal(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Doação, Despesas diversas..."
                isInvalid={!!errors.descricao}
              />
              <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Valor</Form.Label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0.00"
                  isInvalid={!!errors.valor}
                />
                <Form.Control.Feedback type="invalid">{errors.valor}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{ backgroundColor: tipo === "entrada" ? "#d4edda" : "#f8d7da" }}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <InputGroup>
                <Form.Select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  isInvalid={!!errors.categoria}
                >
                  {categorias.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="outline-primary"
                  onClick={() => setShowNewCatModal(true)}
                  title="Criar nova categoria"
                >
                  <FaPlus />
                </Button>
                <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                isInvalid={!!errors.data}
              />
              <Form.Control.Feedback type="invalid">{errors.data}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
            <Button type="submit" variant="success" className="px-4">
            Salvar Lançamento
            </Button>
        </div>
      </Form>

      {/* Modal para nova categoria */}
      <Modal show={showNewCatModal} onHide={() => setShowNewCatModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nova Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nome da categoria</Form.Label>
            <Form.Control
              type="text"
              value={newCategoria}
              onChange={(e) => setNewCategoria(e.target.value)}
              placeholder="Digite a categoria..."
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewCatModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddCategoria}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FluxoForm;

