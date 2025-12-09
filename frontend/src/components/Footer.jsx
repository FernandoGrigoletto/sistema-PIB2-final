import { Container, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaClock, FaChurch, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-secondary py-4 mt-auto border-top no-print">
      <Container>
        <Row className="text-center g-4">
          {/* Localização */}
          <Col md={4}>
            <div className="d-flex flex-column align-items-center">
              <div className="mb-2 text-primary bg-primary bg-opacity-10 p-2 rounded-circle">
                <FaMapMarkerAlt size={18} />
              </div>
              <h6 className="fw-bold mb-1 text-dark">Localização</h6>
              <span className="small text-muted">
                Avenida Presidente Vargas, 618<br />
                Osvaldo Cruz, SP, Brazil
              </span>
            </div>
          </Col>

          {/* História */}
          <Col md={4}>
            <div className="d-flex flex-column align-items-center">
              <div className="mb-2 text-primary bg-primary bg-opacity-10 p-2 rounded-circle">
                <FaChurch size={18} />
              </div>
              <h6 className="fw-bold mb-1 text-dark">Nossa História</h6>
              <span className="small text-muted">
                77 anos em Osvaldo Cruz
              </span>
            </div>
          </Col>

          {/* Cultos */}
          <Col md={4}>
            <div className="d-flex flex-column align-items-center">
              <div className="mb-2 text-primary bg-primary bg-opacity-10 p-2 rounded-circle">
                <FaClock size={18} />
              </div>
              <h6 className="fw-bold mb-1 text-dark">Horário dos Cultos</h6>
              <span className="small text-muted">
                <strong>Quinta-Feira:</strong> 19h30<br />
                <strong>Domingo:</strong> 9h (EBD) e 19h (Celebração)
              </span>
            </div>
          </Col>
        </Row>
        
        {/* Redes Sociais */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <a 
            href="https://www.facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-secondary hover-primary"
            title="Facebook"
          >
            <FaFacebook size={24} />
          </a>
          <a 
            href="https://www.instagram.com/pibocruz/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-secondary hover-primary"
            title="Instagram"
          >
            <FaInstagram size={24} />
          </a>
        </div>

        <div className="text-center mt-4 pt-3 border-top x-small text-muted">
            &copy; {new Date().getFullYear()} Primeira Igreja Batista em Osvaldo Cruz. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;