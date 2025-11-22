import { Button, Col, Container, Row,Modal } from "react-bootstrap";
import { useState,useEffect } from "react";
import OracaoList from "../components/OracaoList";
import oracaoService from "../services/oracaoService";
import OracaoForm from "../components/OracaoForm";
import OracaoFiltro from "../components/OracaoFiltro";


const Oracoes = () => {
 const [showForm, setShowForm] = useState(false);

  const [oracoes,setOracoes]=useState([]);
  const [oracaoToDelete, setOracaoToDelete] = useState(null);
     const [showDeleteModal, setShowDeleteModal] = useState(false);

     const loadOracao = async () => {
    const dados = await oracaoService.getAll();

    setOracoes(dados);
  };

 useEffect(() => {
    loadOracao();
  }, []);

  const handleSaveOracao =async (oracao) => {

    if(oracao.id>0){
      await oracaoService.update(oracao)
      await loadOracao();

    }else{
      const saved =await oracaoService.add(oracao);
      setOracoes([...oracoes, saved]);

    }
    

    setShowForm(false);
  };


    

  const handleConfirmDelete=(id)=>{

    setOracaoToDelete(id)
    setShowDeleteModal(true);
  }


   

      const handleDeleteOracao =async()=>{
            
     const updatedOracoes =await oracaoService.remove(oracaoToDelete)
      setOracoes(updatedOracoes);
         setShowDeleteModal(false);
           setOracaoToDelete(null);
   }



    return (

<Container className="py-4">

    <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
            <h1>Gerenciamento de Orações</h1>
            <Button variant="success" onClick={()=>setShowForm(!showForm)} >
                { showForm ? 'Cancelar':'Adicionar Oração' }
            </Button>
           
        </Col>
        
    </Row>

  {

    showForm  && (
   <Row className="mb-4">
        
        <Col>

          <OracaoForm onSave={handleSaveOracao}></OracaoForm>

          
          
        </Col>
    </Row>


    )
  }

      <Row>
        
        <OracaoList oracao={oracoes} onDelete={handleConfirmDelete}></OracaoList>
             
    </Row>
 
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este evento?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteOracao}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>


 </Container>


   
    )
}

export default Oracoes;