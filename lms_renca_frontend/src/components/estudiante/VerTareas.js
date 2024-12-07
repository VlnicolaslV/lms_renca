import React, { useEffect, useState } from 'react';
import { EstudianteService } from '../../services/estudianteService';
import SubirRespuesta from './SubirRespuesta';
import './estudianteCss/verTareas.css';

const VerTareas = ({ asignaturaId, estudianteRut, onResponderTareaClick }) => {
    const [tareas, setTareas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [selectedTareaId, setSelectedTareaId] = useState(null);

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                if (!estudianteRut) {
                    throw new Error("El rut del estudiante es undefined");
                }
                const tareasResponse = await EstudianteService.obtener_tareas(estudianteRut);
                setTareas(tareasResponse);

                const respuestasResponse = await EstudianteService.obtener_respuestas(estudianteRut);
                setRespuestas(respuestasResponse);
            } catch (error) {
                console.error("Error al obtener tareas o respuestas:", error);
            }
        };
        fetchTareas();
    }, [estudianteRut]);

    const handleResponderTareaClick = (tareaId) => {
        setSelectedTareaId(tareaId);
        setShowResponseForm(true);
    };

    const handleResponseSubmitted = () => {
        setShowResponseForm(false);
        setSelectedTareaId(null);
        // Refresh tasks and responses
        const fetchTareas = async () => {
            const tareasResponse = await EstudianteService.obtener_tareas(estudianteRut);
            setTareas(tareasResponse);

            const respuestasResponse = await EstudianteService.obtener_respuestas(estudianteRut);
            setRespuestas(respuestasResponse);
        };
        fetchTareas();
    };

    const getRespuestasForTarea = (tareaId) => {
        return respuestas.filter(respuesta => respuesta.tarea === tareaId);
    };

    if (showResponseForm && selectedTareaId) {
        return <SubirRespuesta tareaId={selectedTareaId} estudianteRut={estudianteRut} onResponseSubmitted={handleResponseSubmitted} />;
    }

    if (!tareas.length) {
        return <div>Cargando tareas...</div>;
    }

    return (
        <div className="ver-tareas-container">
            <h2>Tareas</h2>
            <div className="tareas-grid">
                {tareas.map((tarea, index) => (
                    <div key={index} className="tarea-card">
                        <h3>{tarea.titulo}</h3>
                        <p>{tarea.descripcion}</p>
                        {tarea.archivo && (
                            <a href={`http://localhost:8000/${tarea.archivo}`} download>Descargar Archivo</a>
                        )}
                        <p>Fecha de entrega: {new Date(tarea.fecha_entrega).toLocaleDateString()}</p>
                        <button onClick={() => handleResponderTareaClick(tarea.id)}>Responder Tarea</button>
                        <div className="respuestas">
                            {getRespuestasForTarea(tarea.id).map((respuesta, index) => (
                                <div key={index} className="respuesta">
                                    <p><strong>Comentario:</strong> {respuesta.comentario}</p>
                                    {respuesta.archivo_respuesta && (
                                        <a href={`http://localhost:8000/${respuesta.archivo_respuesta}`} download>Descargar Respuesta</a>
                                    )}
                                    <p><strong>Fecha de envío:</strong> {new Date(respuesta.fecha_envio).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerTareas;
