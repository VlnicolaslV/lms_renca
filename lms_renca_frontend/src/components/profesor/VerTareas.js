import React, { useState, useEffect, useCallback } from 'react';
import profesorService from '../../services/profesorService';
import { Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import './profesorCss/verTareas.css';

const VerTareas = ({ idCursoAsignatura, setSubSubSelectedOption }) => {
    const [tareas, setTareas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const tareasData = await profesorService.obtenerTareas(idCursoAsignatura);
                setTareas(tareasData);
            } catch (error) {
                console.error("Error al obtener las tareas:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTareas();
    }, [idCursoAsignatura]);

    const handleCrearTarea = useCallback(() => {
        setSubSubSelectedOption('crearTarea', idCursoAsignatura);
    }, [setSubSubSelectedOption, idCursoAsignatura]);

    const calificarTarea = useCallback((idTarea) => {
        console.log("Calificar tarea:", idTarea);
    }, []);

    if (isLoading) {
        return <div>Cargando tareas...</div>;
    }

    return (
        <div className="ver-tareas-container">
            <h2>Tareas Realizadas</h2>
            <Button color="primary" onClick={handleCrearTarea} style={{ marginBottom: '20px' }}>Crear Nueva Tarea</Button>
            <div className="tareas-grid">
                {tareas.map(({ id, titulo, descripcion, archivo, fecha_publicacion, fecha_entrega }) => (
                    <Card key={id} className="tarea-card">
                        <CardBody>
                            <CardTitle tag="h5">{titulo}</CardTitle>
                            <CardText>
                                {descripcion}<br />
                                {archivo && <a href={`http://localhost:8000/${archivo}`} download>Descargar Archivo</a>}<br />
                                Fecha de Publicación: {new Date(fecha_publicacion).toLocaleDateString()}<br />
                                Fecha de Entrega: {new Date(fecha_entrega).toLocaleDateString()}
                            </CardText>
                            <Button color="primary" onClick={() => calificarTarea(id)}>Calificar</Button>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VerTareas;
