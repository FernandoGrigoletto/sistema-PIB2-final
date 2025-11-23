import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";

const EventoForm = ({ onSave, onCancel, evento: eventoToEdit }) => {
  const [evento, setEvento] = useState({
    titulo: "",
    description: "",
    category: "Culto",
    brand: "", // Data
    arquivo: null // Para o arquivo
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (eventoToEdit) {
      setEvento({
        id: eventoToEdit.id,
        titulo: eventoToEdit.titulo || "",
        description: eventoToEdit.description || "",
        category: eventoToEdit.category || "",
        brand: eventoToEdit.brand ? new Date(eventoToEdit.brand).toISOString().split('T')[0] : "",
        arquivo: null, // Reset arquivo no edit pois é input file
      });
    } else {
      setEvento({
        titulo: "",
        description: "",
        category: "Culto",
        brand: "",
        arquivo: null
      });
    }
  }, [eventoToEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'arquivo') {
        setEvento((prev) => ({ ...prev, arquivo: files[0] }));
    } else {
        setEvento((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    onSave(evento);
    setValidated(false);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">{eventoToEdit ? "Editar Evento" : "Adicionar Evento"}</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                        type="text"
                        name="titulo"
                        value={evento.titulo}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Culto da Virada"
                    />
                </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={evento.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  name="category"
                  value={evento.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Culto">Culto</option>
                  <option value="Festa">Festa</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Outros">Outros</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  name="brand"
                  value={evento.brand}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
                <Form.Group className="mb-3">
                    <Form.Label>Imagem ou Vídeo</Form.Label>
                    <Form.Control 
                        type="file" 
                        name="arquivo" 
                        onChange={handleChange} 
                        accept="image/*,video/*"
                    />
                </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default EventoForm;
