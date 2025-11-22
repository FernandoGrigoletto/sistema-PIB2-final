import { Container, Row } from "react-bootstrap";
import OracaoForm from "../components/OracaoForm";
import oracaoService from "../services/oracaoService";
import { useEffect, useState } from "react";


const Home = () => {
  const [ setOracoes] = useState([]);

   useEffect(() => {
    const loadOracao = async () => {
      try {
        const dados = await oracaoService.getAll();
        setOracoes(dados);
      } catch (error) {
        console.error("Erro ao carregar orações:", error);
      }
    };

    loadOracao();
  }, []);

 const handleSaveOracao = async (oracao) => {
    try {
      const saved = await oracaoService.add(oracao);
      setOracoes((prev) => [...prev, saved]);
    } catch (error) {
      console.error("Erro ao salvar oração:", error);
    }
  };

  return (
    <Container className="d-flex flex-column min-vh-100">
      <Row className="mb-4">
        <h1>Bem-vindo ao sistema Igreja</h1>
      </Row>
      

      <Row className="mt-auto">
        <OracaoForm onSave={handleSaveOracao} />
      </Row>
    </Container>
    
  );
};

export default Home;

