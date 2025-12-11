import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import userService from '../services/userService';

const Usuarios = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ nome: '', email: '', password: '', role: 'membro' });
    const [error, setError] = useState('');

    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            if (Array.isArray(data)) setUsers(data);
        } catch (err) {
            console.error("Erro ao carregar usuários", err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        setError('');
        if (user) {
            setEditingUser(user);
            // Ao editar, a senha começa vazia (só preenche se quiser trocar)
            setFormData({ nome: user.nome, email: user.email, role: user.role, password: '' });
        } else {
            setEditingUser(null);
            setFormData({ nome: '', email: '', password: '', role: 'membro' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.update(editingUser.id, formData);
            } else {
                await userService.create(formData);
            }
            setShowModal(false);
            loadUsers();
        } catch (err) {
            setError('Erro ao salvar usuário. Verifique os dados.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await userService.remove(id);
                loadUsers();
            } catch (err) {
                alert('Erro ao excluir usuário');
            }
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-secondary fw-bold">Gerenciar Usuários</h2>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    <FaUserPlus className="me-2" /> Novo Usuário
                </Button>
            </div>

            <Table responsive hover className="shadow-sm bg-white rounded">
                <thead className="bg-light">
                    <tr>
                        <th className="ps-4">Nome</th>
                        <th>E-mail</th>
                        <th>Permissão</th>
                        <th className="text-end pe-4">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="ps-4 fw-bold text-secondary">{user.nome}</td>
                            <td>{user.email}</td>
                            <td>
                                <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'operador' ? 'warning' : 'info'}>
                                    {user.role === 'admin' ? <FaUserShield className="me-1"/> : <FaUser className="me-1"/>}
                                    {user.role.toUpperCase()}
                                </Badge>
                            </td>
                            <td className="text-end pe-4">
                                <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleOpenModal(user)}>
                                    <FaEdit size={18} />
                                </Button>
                                <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(user.id)}>
                                    <FaTrash size={18} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de Cadastro/Edição */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Nome Completo</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control 
                                type="email" 
                                required 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Senha {editingUser && <small className="text-muted">(Deixe em branco para manter a atual)</small>}</Form.Label>
                            <Form.Control 
                                type="password" 
                                required={!editingUser} // Obrigatório apenas se for novo
                                minLength={6}
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nível de Permissão</Form.Label>
                            <Form.Select 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="membro">Membro (Padrão)</option>
                                <option value="operador">Operador (Edita conteúdos)</option>
                                <option value="admin">Administrador (Acesso total)</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Salvar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Usuarios;