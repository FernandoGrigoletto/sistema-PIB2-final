import { Badge } from "react-bootstrap";

const MembroStatusBadge = ({ status }) => {
  let variant = "secondary"; // Cor padrão (cinza)

  switch (status) {
    case "Ativo":
      variant = "success"; // Verde
      break;
    case "Inativo":
      variant = "danger"; // Vermelho
      break;
    case "Ausente":
      variant = "warning"; // Amarelo/Laranja
      break;
    case "Visitante":
      variant = "info"; // Azul claro
      break;
    default:
      variant = "secondary";
  }

  return (
    <Badge bg={variant} className="fw-normal px-2 py-1">
      {status}
    </Badge>
  );
};

export default MembroStatusBadge;
