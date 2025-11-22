import { useEffect } from "react";
import { useState } from "react";
import { Card, Col, Form, FormGroup, Row,Button } from "react-bootstrap";

const EventoForm = ({ onSave, onCancel, evento:eventoToEdit }) => {
  const [evento, setEvento] = useState({
    description: "",
    category: "Culto",
    brand: "",

  });

  const [validated, setValidated] = useState(false);

  useEffect(()=>{
    if(eventoToEdit){
      setEvento({
        id:eventoToEdit.id,
        description: eventoToEdit.description || "",
        category: eventoToEdit.category || "",
        brand: eventoToEdit.brand || "",
      });
    }else{
      setEvento({
        description: "",
        category: "Culto",
        brand: "",
      });
    }

  },[eventoToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento((prev) => ({
      ...prev,
      [name]: name === "dailyValue" ? parseFloat(value) || "" : value,
    }));
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

    setEvento({
      description: "",
      category: "Culto",
      brand: "",
     
    });

    setValidated(false);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Adicionar Evento</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>

              <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={evento.description}
                onChange={handleChange}
                required
              />

              <Form.Control.Feedback type="invalid">
                Por favor informe uma descrição.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>


          <Col md={4}>
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


          
          </Row>
        
        
        <Row>
               <Col md={4}>
                <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="brand"
                value={evento.brand}
                onChange={handleChange}
                required
              />

              <Form.Control.Feedback type="invalid">
                Por favor informe uma Data.
              </Form.Control.Feedback>
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
