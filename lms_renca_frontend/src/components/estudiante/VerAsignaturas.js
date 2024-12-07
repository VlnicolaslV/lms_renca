import React, { useEffect, useState } from 'react';
import { EstudianteService } from '../../services/estudianteService';
import VerForo from './VerForo';
import VerRecursos from './VerRecursos';
import VerTareas from './VerTareas';  // Importamos el componente VerTareas
import './estudianteCss/verAsignaturas.css';

const VerAsignaturas = ({ onButtonClick, estudianteRut, onResponderTareaClick }) => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedAsignaturaId, setSelectedAsignaturaId] = useState(null);
    const [view, setView] = useState('');

    useEffect(() => {
        const fetchAsignaturas = async () => {
            try {
                const response = await EstudianteService.obtener_cursos_y_asignaturas();
                setAsignaturas(response.asignaturas); // Asumimos que la respuesta contiene las asignaturas
            } catch (error) {
                console.error("Error al obtener las asignaturas:", error);
            }
        };
        fetchAsignaturas();
    }, []);

    const handleForoClick = (asignaturaId) => {
        setSelectedAsignaturaId(asignaturaId);
        setView('foro');
    };

    const handleRecursosClick = (asignaturaId) => {
        setSelectedAsignaturaId(asignaturaId);
        setView('recursos');
    };

    const handleTareasClick = (asignaturaId) => {
        setSelectedAsignaturaId(asignaturaId);
        setView('tareas');
    };

    if (selectedAsignaturaId && view === 'foro') {
        return <VerForo asignaturaId={selectedAsignaturaId} />;
    }

    if (selectedAsignaturaId && view === 'recursos') {
        return <VerRecursos asignaturaId={selectedAsignaturaId} />;
    }

    if (selectedAsignaturaId && view === 'tareas') {
        return (
            <VerTareas
                asignaturaId={selectedAsignaturaId}
                estudianteRut={estudianteRut}
                onResponderTareaClick={onResponderTareaClick}
            />
        );
    }

    if (!asignaturas.length) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="ver-asignaturas-container">
            <h2>Asignaturas</h2>
            <div className="asignaturas-grid">
                {asignaturas.map((asignatura, index) => (
                    <div key={index} className="asignatura-card">
                        <h3>{asignatura.nombre}</h3>
                        <p>Profesor: {asignatura.profesor_nombre} {asignatura.profesor_apellido}</p>
                        <div className="asignatura-buttons">
                            <button className="asignatura-button" onClick={() => handleForoClick(asignatura.id)}>Foro</button>
                            <button className="asignatura-button" onClick={() => handleRecursosClick(asignatura.id)}>Recursos</button>
                            <button className="asignatura-button" onClick={() => handleTareasClick(asignatura.id)}>Tareas</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerAsignaturas;
