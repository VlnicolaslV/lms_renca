import React, { useEffect, useState } from 'react';
import { EstudianteService } from '../../services/estudianteService';
import './estudianteCss/verRecursos.css';

const VerRecursos = ({ asignaturaId }) => {
    const [recursos, setRecursos] = useState([]);

    useEffect(() => {
        const fetchRecursos = async () => {
            try {
                const response = await EstudianteService.obtener_recursos(asignaturaId);
                setRecursos(response);
            } catch (error) {
                console.error("Error al obtener los recursos:", error);
            }
        };
        fetchRecursos();
    }, [asignaturaId]);

    const handleDescargar = async (recursoId) => {
        try {
            await EstudianteService.descargar_recurso(recursoId);
            alert("Recurso descargado exitosamente");
        } catch (error) {
            console.error("Error al descargar el recurso:", error);
        }
    };

    if (!recursos.length) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="ver-recursos-container">
            <h2>Recursos de la Asignatura</h2>
            <div className="recursos-grid">
                {recursos.map((recurso, index) => (
                    <div key={index} className="recurso-card">
                        <h3>{recurso.nombre}</h3>
                        <p>{recurso.descripcion}</p>
                        <button onClick={() => handleDescargar(recurso.id)}>Descargar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerRecursos;
