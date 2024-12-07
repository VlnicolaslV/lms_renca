import React, { useState, useEffect } from 'react';
import profesorService from '../../services/profesorService';

const TomarAsistencias = ({ idCursoAsignatura }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [fecha, setFecha] = useState('');
    const [asistencia, setAsistencia] = useState({});

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const estudiantesData = await profesorService.obtenerEstudiantes(idCursoAsignatura);
                setEstudiantes(estudiantesData);
            } catch (error) {
                console.error("Error al obtener los estudiantes:", error);
            }
        };
        fetchEstudiantes();
    }, [idCursoAsignatura]);

    const handleAsistenciaChange = (idEstudiante, presente) => {
        setAsistencia({ ...asistencia, [idEstudiante]: presente });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const idEstudiante in asistencia) {
            try {
                await profesorService.tomarAsistencia(idCursoAsignatura, idEstudiante, { fecha, presente: asistencia[idEstudiante] });
            } catch (error) {
                console.error(`Error al tomar asistencia para el estudiante ${idEstudiante}:`, error);
            }
        }
    };

    return (
        <div>
            <h2>Tomar Asistencias</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Fecha:</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div>
                    <ul>
                        {estudiantes.map((estudiante) => (
                            <li key={estudiante.id}>
                                {estudiante.nombre}
                                <label>
                                    <input
                                        type="radio"
                                        name={`asistencia-${estudiante.id}`}
                                        value="presente"
                                        checked={asistencia[estudiante.id] === true}
                                        onChange={() => handleAsistenciaChange(estudiante.id, true)}
                                    />
                                    Presente
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`asistencia-${estudiante.id}`}
                                        value="ausente"
                                        checked={asistencia[estudiante.id] === false}
                                        onChange={() => handleAsistenciaChange(estudiante.id, false)}
                                    />
                                    Ausente
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Registrar Asistencia</button>
            </form>
        </div>
    );
};

export default TomarAsistencias;
