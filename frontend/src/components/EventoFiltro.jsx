import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

import eventoService from "../services/eventoService";

function EventoFiltro({ onFiltersChange }) {
    const [eventoFilters, setEventoFilter] = useState({
        category: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventoFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const aplicarFiltros = async () => {
        const data = await eventoService.getAll(eventoFilters);
        if (onFiltersChange) {
            onFiltersChange(data);
        }
        console.log("Dados filtrados:", data);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [eventoFilters]);

    return (
        <Card className="mb-5">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Filtros de Eventos</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                name="category"
                                value={eventoFilters.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Todos</option>
                                <option value="Culto">Culto</option>
                                <option value="Festa">Festa</option>
                                <option value="Reunião">Reunião</option>
                                <option value="Outros">Outros</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default EventoFiltro;