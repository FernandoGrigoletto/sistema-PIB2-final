import { Container, Row, Col, Card } from "react-bootstrap";
import { FaPray, FaHeart } from "react-icons/fa";
import oracaoService from "../services/oracaoService";
import OracaoForm from "../components/OracaoForm";

const Oracoes = () => {

  const handleSaveOracao = async (oracao) => {
    try {
      await oracaoService.add(oracao);
      alert("Seu pedido de oração foi enviado com sucesso! Estaremos orando por você.");
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao enviar seu pedido. Tente novamente.");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center py-5">
      <Container>
        <Row className="justify-content-center">
          
          <Col md={11} lg={10} xl={8}>
            
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              
              {/* Cabeçalho */}
              <div className="bg-success p-4 text-center text-white position-relative" 
                   style={{ background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}>
                <div className="position-absolute top-0 start-50 translate-middle rounded-circle bg-white text-success d-flex align-items-center justify-content-center shadow-sm"
                     style={{ width: '70px', height: '70px', marginTop: '10px' }}>
                  <FaPray size={32} />
                </div>
                <div className="mt-4 pt-2">
                  {/* Título ajustado para refletir a ação */}
                  <h2 className="fw-bold mb-1">Faça seu Pedido de Oração</h2>
                  <p className="mb-0 opacity-75 lead">Estamos aqui para interceder por você</p>
                </div>
              </div>

              <Card.Body className="p-4 p-md-5 bg-white">
                
                <div className="text-center mb-5 px-md-5">
                  <p className="text-muted fst-italic fs-5">
                    "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, 
                    e com ação de graças, apresentem seus pedidos a Deus."
                  </p>
                  <div className="d-flex align-items-center justify-content-center gap-2 text-success small fw-bold">
                    <span style={{ height: '2px', width: '40px', background: '#198754' }}></span>
                    FILIPENSES 4:6
                    <span style={{ height: '2px', width: '40px', background: '#198754' }}></span>
                  </div>
                </div>

                {/* Área do Formulário */}
                <div className="bg-light bg-opacity-50 p-4 p-md-5 rounded-4 border border-light shadow-sm">
                  {/* Formulário Renderizado (Agora Gigante) */}
                  <OracaoForm onSave={handleSaveOracao} />
                </div>

              </Card.Body>
            </Card>
            
            <div className="text-center mt-4 text-muted">
              <small>Sua identidade e pedido serão tratados com respeito e amor cristão.</small>
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Oracoes;