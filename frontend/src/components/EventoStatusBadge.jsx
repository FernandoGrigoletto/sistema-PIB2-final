import { Badge } from "react-bootstrap";

const EventoStatusBadge =({category})=>{


    let variant;

    switch (category) {
        case 'Culto': variant='success'  
            break;
            case 'Festa': variant='warning'  
            break;
            case 'Reunião': variant='primary'  
            break;
            case 'Outros': variant='info'  
            break;
    
        default:
            variant='secondary';
    }

    return <Badge bg={variant} >{category}</Badge>
}

export default EventoStatusBadge