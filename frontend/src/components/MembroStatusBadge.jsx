import { Badge } from "react-bootstrap";

const MembroStatusBadge = ({ status }) => {
  let variant;

  switch (status) {
    case "Ativo":
      variant = "success";
      break;
    case "Inativo":
      variant = "danger";
      break;
    case "Visitante":
      variant = "primary";
      break;
    case "Ausente":
      variant = "secondary";
  }

  return <Badge bg={variant}>{status}</Badge>;
};

export default MembroStatusBadge;
