import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profesorService from '../../services/profesorService';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import './profesorCss/verRecursos.css';

const VerRecursos = ({ idCursoAsignatura, setSubSubSelectedOption }) => {
    const [recursos, setRecursos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecursos = async () => {
            try {
                const recursosData = await profesorService.obtenerRecursos(idCursoAsignatura);
                setRecursos(recursosData);
            } catch (error) {
                console.error("Error al obtener los recursos:", error);
            }
        };
        fetchRecursos();
    }, [idCursoAsignatura]);

    const handleCrearRecurso = () => {
        setSubSubSelectedOption('crearRecurso', idCursoAsignatura);
    };

    return (
        <div className="ver-recursos-container">
            <h2>Recursos</h2>
            <Button color="primary" onClick={handleCrearRecurso} style={{ marginBottom: '20px' }}>Crear Recurso</Button>
            <div className="recursos-grid">
                {recursos.map((recurso) => (
                    <Card key={recurso.id} className="recurso-card">
                        <CardBody>
                            <CardTitle tag="h5">{recurso.nombre}</CardTitle>
                            <CardText>{recurso.descripcion}</CardText>
                            {recurso.archivo && (
                                <Button href={recurso.archivo} download color="primary">Descargar Archivo</Button>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VerRecursos;

