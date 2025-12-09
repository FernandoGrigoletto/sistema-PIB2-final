import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { FaUserPlus, FaUsers, FaUserShield, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import apiService from "../services/api";

const Membros = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Erro ao carregar lista de membros.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <Badge bg="danger">Administrador</Badge>;
      case 'operador': return <Badge bg="warning" text="dark">Operador</Badge>;
      default: return <Badge bg="secondary">Membro</Badge>;
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary d-flex align-items-center gap-2">
          <FaUsers /> Gestão de Membros
        </h2>
        <Button as={Link} to="/register" variant="success" className="d-flex align-items-center gap-2 shadow-sm">
          <FaUserPlus /> Novo Usuário
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 ps-4">Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th className="text-end pe-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="ps-4 fw-bold text-dark">
                          <div className="d-flex align-items-center gap-2">
                             <div className="bg-light rounded-circle p-2 text-primary d-flex justify-content-center align-items-center" style={{width: '35px', height: '35px'}}>
                                {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                             </div>
                             {user.nome}
                          </div>
                        </td>
                        <td className="text-muted">{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td className="text-end pe-4">
                          <Button variant="outline-primary" size="sm" disabled title="Editar (Em breve)">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Membros;