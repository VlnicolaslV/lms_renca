import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profesorService from '../../services/profesorService';
import { Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './profesorCss/verForos.css';

const VerForos = ({ idCursoAsignatura, setSubSubSelectedOption }) => {
    const [foros, setForos] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [fechaCreacionComentario, setFechaCreacionComentario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForos = async () => {
            try {
                const forosData = await profesorService.obtenerForos(idCursoAsignatura);
                setForos(forosData);
            } catch (error) {
                console.error("Error al obtener los foros:", error);
            }
        };

        fetchForos();
    }, [idCursoAsignatura]);

    const handleCrearForo = () => {
        setSubSubSelectedOption('crearForo', idCursoAsignatura);
    };

    const handleVerComentarios = async (idForo) => {
        try {
            const comentariosData = await profesorService.obtenerComentarios(idForo);
            setComentarios((prevComentarios) => ({
                ...prevComentarios,
                [idForo]: comentariosData,
            }));
        } catch (error) {
            console.error("Error al obtener los comentarios:", error);
        }
    };

    const handleComentar = async (idForo) => {
        if (!nuevoComentario || !fechaCreacionComentario) return;

        try {
            await profesorService.comentarForo(idForo, nuevoComentario, fechaCreacionComentario);
            setNuevoComentario('');
            setFechaCreacionComentario('');
            handleVerComentarios(idForo);
        } catch (error) {
            console.error("Error al comentar en el foro:", error);
        }
    };

    return (
        <div className="ver-foros-container">
            <h2>Foros</h2>
            <Button color="primary" onClick={handleCrearForo} style={{ marginBottom: '20px' }}>Crear Foro</Button>
            <div className="foros-grid">
                {foros.map((foro) => (
                    <Card key={foro.id} className="foro-card">
                        <CardBody>
                            <CardTitle tag="h5">{foro.titulo}</CardTitle>
                            <CardText>{foro.tema}</CardText>
                            <CardText>Fecha de Creación: {new Date(foro.fecha_creacion).toLocaleDateString()}</CardText>
                            <Button color="secondary" onClick={() => handleVerComentarios(foro.id)}>Ver Comentarios</Button>
                            {comentarios[foro.id] && (
                                <div className="comentarios-section">
                                    {comentarios[foro.id].map((comentario) => (
                                        <div key={comentario.id} className="comentario">
                                            <p><strong>{comentario.usuario_nombre} ({comentario.usuario_rut}):</strong> {comentario.comentario}</p>
                                            <p className="fecha-comentario">{new Date(comentario.fecha_creacion).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                    <Form onSubmit={(e) => { e.preventDefault(); handleComentar(foro.id); }}>
                                        <FormGroup>
                                            <Label for="nuevoComentario">Nuevo Comentario</Label>
                                            <Input
                                                type="textarea"
                                                name="nuevoComentario"
                                                id="nuevoComentario"
                                                value={nuevoComentario}
                                                onChange={(e) => setNuevoComentario(e.target.value)}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="fechaCreacionComentario">Fecha de Creación del Comentario</Label>
                                            <Input
                                                type="date"
                                                name="fechaCreacionComentario"
                                                id="fechaCreacionComentario"
                                                value={fechaCreacionComentario}
                                                onChange={(e) => setFechaCreacionComentario(e.target.value)}
                                                required
                                            />
                                        </FormGroup>
                                        <Button type="submit" color="primary">Comentar</Button>
                                    </Form>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VerForos;
