import { useState } from "react";
import { Card, Col, Form, FormGroup, Row,Button } from "react-bootstrap";

const OracaoForm = ({ onSave }) => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "2025-06-10"
  };


  const [oracao, setOracao] = useState({
    nome: "",
    contato: "",
    pedido: "",  
    data:getTodayDate(),  
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOracao((prev) => ({
      ...prev,
      [name]: value,
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

    onSave(oracao);

    setOracao({
      nome: "",
      contato: "",
      pedido: "",
      data:getTodayDate(), 
     
    });

    setValidated(false);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Adicionar Oração</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>

              <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={oracao.nome}
                onChange={handleChange}
                
              />

              
            </Form.Group>
          </Col>



          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contato</Form.Label>
              <Form.Control
                type="text"
                name="contato"
                value={oracao.contato}
                onChange={handleChange}
                
              />

              
            </Form.Group>
          </Col>
          </Row>
        
        
        <Row>
               <Col md={4}>
                <Form.Group className="mb-4">
              <Form.Label>Pedir sua oração:</Form.Label>
              <Form.Control
               
                type="text"
                name="pedido"
                value={oracao.pedido}
                onChange={handleChange}
                required             
                as="textarea" rows={3}
                
              />

              <Form.Control.Feedback type="invalid">
                Por favor faça um pedido oração.
              </Form.Control.Feedback>
            </Form.Group>
               </Col>              

                      
        </Row>
                 

              <div className="d-flex justify-content-end gap-2">
            
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default OracaoForm;