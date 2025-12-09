import membroService from "../services/membroService";

import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const MembroForm = ({ onSave, onCancel, membro: membroToEdit }) => {
  const [membro, setMembro] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    email: "",
    cpf: "",
    nasc: "",
    genero: "",
    telefone: "",
    status: "",
  });

  const [validated, setValidated] = useState(false);

  const [cpfDuplicado, setCpfDuplicado] = useState(false);

  useEffect(() => {
    if (membroToEdit) {
      setMembro({
        id: membroToEdit.id,
        nome: membroToEdit.nome || "",
        endereco: membroToEdit.endereco || "",
        cidade: membroToEdit.cidade || "",
        email: membroToEdit.email || "",
        cpf: membroToEdit.cpf || "",
        nasc: membroToEdit.nasc || "",
        genero: membroToEdit.genero || "",
        telefone: membroToEdit.telefone || "",
        status: membroToEdit.status || "Ativo",
      });
    } else {
      setMembro({
        nome: "",
        endereco: "",
        cidade: "",
        email: "",
        cpf: "",
        nasc: "",
        genero: "",
        telefone: "",
        status: "Ativo",
      });
    }
  }, [membroToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cpf") {
      newValue = value.replace(/\D/g, "");

      if (newValue.length <= 11) {
        newValue = newValue
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
    }

    if (name === "telefone") {
      newValue = value.replace(/\D/g, "");

      if (newValue.length <= 11) {
        newValue = newValue
          .replace(/^(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      }
    }

    setMembro((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const cpfSemMascara = membro.cpf.replace(/\D/g, "");

      const cpfExiste = await membroService.verificarCpfExistente(
        cpfSemMascara,
        membro.id // Se for edição, permite o mesmo CPF
      );

      if (cpfExiste) {
        setCpfDuplicado(true);
        return;
      } else {
        setCpfDuplicado(false);
      }

      onSave(membro);

      setMembro({
        nome: "",
        endereco: "",
        cidade: "",
        email: "",
        cpf: "",
        nasc: "",
        genero: "",
        telefone: "",
        status: "",
      });

      setValidated(false);
    } catch (error) {
      console.error("Erro ao validar ou salvar membro:", error);
    }
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Adicionar Membro</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 flex-start">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={membro.nome}
                  onChange={handleChange}
                  required
                />

                <Form.Control.Feedback type="invalid">
                  Por favor informe um nome.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3 flex-start">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  name="cpf"
                  value={membro.cpf}
                  onChange={handleChange}
                  required
                  pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                />

                <Form.Control.Feedback type="invalid">
                  {cpfDuplicado
                    ? "Este CPF já está cadastrado em outro membro."
                    : "Por favor informe seu CPF."}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 flex-start">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="nasc"
                  value={membro.nasc}
                  onChange={handleChange}
                  required
                />

                <Form.Control.Feedback type="invalid">
                  Por favor informe sua Data de Nascimento.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gênero</Form.Label>
                <Form.Select
                  name="genero"
                  value={membro.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  name="endereco"
                  value={membro.endereco}
                  onChange={handleChange}
                  required
                />

                <Form.Control.Feedback type="invalid">
                  Por favor informe um endereço.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  type="text"
                  name="cidade"
                  value={membro.cidade}
                  onChange={handleChange}
                  required
                />

                <Form.Control.Feedback type="invalid">
                  Por favor informe sua cidade.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={membro.email}
                  onChange={handleChange}
                  required
                />

                <Form.Control.Feedback type="invalid">
                  Por favor informe seu email.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={membro.telefone}
                  onChange={handleChange}
                  required
                  pattern="\(\d{2}\) \d{5}-\d{4}"
                />

                <Form.Control.Feedback type="invalid">
                  Por favor informe seu telefone.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={membro.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Visitante">Visitante</option>
                </Form.Select>
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

export default MembroForm;
