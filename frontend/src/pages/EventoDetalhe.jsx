import { Container,Col,Card } from "react-bootstrap";
import { useParams} from "react-router-dom";
import {useState,useEffect } from 'react'
import eventotService from "../services/eventoService";

const EventoDetalhe =()=>{
const {id} =useParams()
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
     const  carregarEvento=async()=>{
       const data =await eventotService.getById(id)

       
         if(data){
            setEvento(data)
            setLoading(false);
         }
      }

      carregarEvento()
    },[id])

    if(!loading){
return (



          <Container className="py-4">
      <Col lg={8} className="mx-auto">
         <Card>
            <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">
                {evento.description}
                    <small className="ms-2">#{evento.id}</small>
            </h4>

             {evento.brand}
            </Card.Header>
         </Card>
      </Col>

  </Container>
    

 )

    }
    else{
    return (



          <Container className="py-4">
            Carregando

  </Container>
    

 )
    }
 

}

export default EventoDetalhe