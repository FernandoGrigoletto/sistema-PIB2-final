import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";

const MembroForm = ({ onSave, onCancel, membro: membroToEdit }) => {
  const [membro, setMembro] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    email: "",
    cpf: "",
    nasc: "",
    genero: "Masculino", // Valor padrão para evitar select vazio
    telefone: "",
    status: "Ativo",
  });

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para erros gerais ou de CPF

  useEffect(() => {
    if (membroToEdit) {
      // Formata a data para YYYY-MM-DD se ela existir
      let dataFormatada = "";
      if (membroToEdit.nasc) {
          const dataObj = new Date(membroToEdit.nasc);
          // Garante que pega a data correta ajustando timezone ou pegando substring se for ISO simples
          dataFormatada = dataObj.toISOString().split('T')[0];
      }

      setMembro({
        id: membroToEdit.id,
        nome: membroToEdit.nome || "",
        endereco: membroToEdit.endereco || "",
        cidade: membroToEdit.cidade || "",
        email: membroToEdit.email || "",
        cpf: formatarCPF(membroToEdit.cpf || ""), // Aplica máscara visual
        nasc: dataFormatada, 
        genero: membroToEdit.genero || "Masculino",
        telefone: formatarTelefone(membroToEdit.telefone || ""), // Aplica máscara visual
        status: membroToEdit.status || "Ativo",
      });
    } else {
      // Reset
      setMembro({
        nome: "",
        endereco: "",
        cidade: "",
        email: "",
        cpf: "",
        nasc: "",
        genero: "Masculino",
        telefone: "",
        status: "Ativo",
      });
    }
    setErrorMessage("");
    setValidated(false);
  }, [membroToEdit]);

  // --- Funções Auxiliares de Máscara (Reutilizáveis) ---
  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14); // Limita tamanho
  };

  const formatarTelefone = (value) => {
     let r = value.replace(/\D/g, "");
     if (r.length > 11) r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
     else if (r.length > 5) r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
     else if (r.length > 2) r = r.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
     else r = r.replace(/^(\d*)/, "($1");
     return r;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cpf") newValue = formatarCPF(value);
    if (name === "telefone") newValue = formatarTelefone(value);

    setMembro((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Chamamos o onSave (que vai chamar a API).
      // Se a API retornar erro (ex: CPF duplicado), ela vai lançar uma exceção que pegamos no catch.
      await onSave(membro);

      // Sucesso: limpar formulário (se não for edição, o pai geralmente fecha o form, mas limpamos por garantia)
      if (!membro.id) {
          setMembro({
            nome: "", endereco: "", cidade: "", email: "", cpf: "", nasc: "", 
            genero: "Masculino", telefone: "", status: "Ativo",
          });
          setValidated(false);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      // Ajuste para suportar tanto Axios quanto Fetch nativo
      const msg = error.response?.data?.message || error.message || "Erro ao salvar membro.";
      setErrorMessage(msg);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">{membro.id ? "Editar Membro" : "Adicionar Membro"}</h5>
      </Card.Header>
      <Card.Body>
        
        {/* Exibe erros do backend (ex: CPF duplicado) aqui */}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={membro.nome}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">Informe o nome.</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  name="cpf"
                  value={membro.cpf}
                  onChange={handleChange}
                  required
                  placeholder="000.000.000-00"
                />
                <Form.Control.Feedback type="invalid">Informe um CPF válido.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="nasc"
                  value={membro.nasc}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">Informe a data.</Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">Email inválido.</Form.Control.Feedback>
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
                  placeholder="(00) 00000-0000"
                />
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
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Visitante">Visitante</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {membro.id ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MembroForm;