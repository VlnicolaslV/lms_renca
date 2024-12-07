import React, { useEffect, useState } from 'react';
import { EstudianteService } from '../../services/estudianteService';
import './estudianteCss/verCurso.css';

const VerCurso = ({ onButtonClick }) => {
    const [curso, setCurso] = useState(null);

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const response = await EstudianteService.obtener_cursos_y_asignaturas();
                if (response.cursos.length > 0) {
                    setCurso(response.cursos[0]); // Asumiendo que el estudiante está inscrito en un curso
                }
            } catch (error) {
                console.error("Error al obtener los datos del curso:", error);
            }
        };
        fetchCurso();
    }, []);

    const handleButtonClick = (view) => {
        onButtonClick(view);
    };

    if (!curso) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="ver-curso-container">
            <div className="ver-curso-header">
                <h2>Curso: {curso.nombre} - {curso.grado}</h2>
            </div>
            <div className="ver-curso-main">
                <h2>Mi Curso</h2>
                <div className="ver-curso-buttons">
                    <button className="ver-curso-button" onClick={() => handleButtonClick('asignaturas')}>Asignaturas</button>
                    <button className="ver-curso-button" onClick={() => handleButtonClick('horario')}>Horario</button>
                </div>
            </div>
        </div>
    );
};

export default VerCurso;
