import React, { useState, useEffect, useCallback } from 'react';
import profesorService from '../../services/profesorService';
import { Card, Button, CardTitle, CardText, CardBody } from 'reactstrap';
import './profesorCss/verCursos.css';

const VerCursos = ({ setSubSubSelectedOptionAsignatura, setSubSubSelectedOption }) => {
    const [cursos, setCursos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const cursosData = await profesorService.obtenerCursosProfesor();
                setCursos(cursosData);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCursos();
    }, []);

    const handleVerCurso = (curso) => {
        setSubSubSelectedOption('verCurso', curso.asignatura.id);
    };

    const handleVerTareas = useCallback((cursoAsignaturaId) => {
        setSubSubSelectedOptionAsignatura('verTareas', cursoAsignaturaId);
    }, [setSubSubSelectedOptionAsignatura]);

    const handleVerForos = useCallback((cursoAsignaturaId) => {
        setSubSubSelectedOptionAsignatura('verForos', cursoAsignaturaId);
    }, [setSubSubSelectedOptionAsignatura]);

    const handleVerRecursos = useCallback((cursoAsignaturaId) => {
        setSubSubSelectedOptionAsignatura('recursos', cursoAsignaturaId);
    }, [setSubSubSelectedOptionAsignatura]);

    const handleVerAsistencias = useCallback((cursoAsignaturaId) => {
        setSubSubSelectedOptionAsignatura('verAsistencias', cursoAsignaturaId);
    }, [setSubSubSelectedOptionAsignatura]);

    if (isLoading) {
        return <div>Cargando cursos...</div>;
    }

    return (
        <div className="cursos-container">
            <h2>Mis Cursos</h2>
            <div className="cursos-grid">
                {cursos && cursos.length > 0 ? (
                    cursos.map((curso) => (
                        <Card key={curso.id} className="curso-card">
                            <CardBody>
                                <CardTitle tag="h5">{curso.asignatura.nombre}</CardTitle>
                                <CardText>
                                    Profesor: {curso.asignatura.profesor_nombre}<br />
                                    Curso: {curso.curso_nombre} - {curso.curso_grado}<br />
                                    Colegio: {curso.colegio_nombre}
                                </CardText>
                                <Button onClick={() => handleVerCurso(curso)}>Ver Curso</Button>
                                <Button onClick={() => handleVerTareas(curso.id)} style={{ marginLeft: '10px' }}>Ver Tareas</Button>
                                <Button onClick={() => handleVerForos(curso.id)} style={{ marginLeft: '10px' }}>Foro</Button>
                                <Button onClick={() => handleVerRecursos(curso.id)} style={{ marginLeft: '10px' }}>Recursos</Button>
                                <Button onClick={() => handleVerAsistencias(curso.id)} style={{ marginLeft: '10px' }}>Asistencia</Button>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <p>No hay cursos disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default VerCursos;
