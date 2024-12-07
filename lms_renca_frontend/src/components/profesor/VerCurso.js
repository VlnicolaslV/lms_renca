import React, { useState, useEffect } from 'react';
import profesorService from '../../services/profesorService';
import './profesorCss/verCurso.css';

const VerCurso = ({ idAsignatura }) => {
    const [curso, setCurso] = useState(null);
    const [alumnos, setAlumnos] = useState([]);
    const [asignaturaNombre, setAsignaturaNombre] = useState("");
    const [cursoNombre, setCursoNombre] = useState("");
    const [cursoGrado, setCursoGrado] = useState("");

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const cursoData = await profesorService.obtenerCursoAsignatura(idAsignatura);
                if (cursoData) {
                    setCurso(cursoData);
                    setAsignaturaNombre(cursoData.asignatura_nombre || 'Sin nombre');
                    setCursoNombre(cursoData.curso_nombre || 'Sin nombre');
                    setCursoGrado(cursoData.curso_grado || 'Sin grado');

                    const inscripcionesData = await profesorService.obtenerEstudiantes(cursoData.id);
                    const alumnosData = inscripcionesData.map(inscripcion => {
                        const n1 = (Math.random() * 6 + 1).toFixed(1); // Genera nota entre 1.0 y 7.0
                        const n2 = (Math.random() * 6 + 1).toFixed(1); // Genera nota entre 1.0 y 7.0
                        const n3 = (Math.random() * 6 + 1).toFixed(1); // Genera nota entre 1.0 y 7.0
                        const n4 = (Math.random() * 6 + 1).toFixed(1); // Genera nota entre 1.0 y 7.0
                        const promedio = ((parseFloat(n1) + parseFloat(n2) + parseFloat(n3) + parseFloat(n4)) / 4).toFixed(2);
                        return {
                            rut: inscripcion.estudiante_rut,
                            nombre: inscripcion.estudiante_nombre,
                            apellido: inscripcion.estudiante_apellido,
                            n1: n1,
                            n2: n2,
                            n3: n3,
                            n4: n4,
                            promedio: promedio
                        };
                    });
                    setAlumnos(alumnosData);
                }
            } catch (error) {
                console.error("Error al obtener el curso y alumnos:", error);
            }
        };
        fetchCurso();
    }, [idAsignatura]);

    if (!curso) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="curso-detalle-container">
            <div className="header">
                <h2>{asignaturaNombre} {cursoNombre} - {cursoGrado}</h2>
                <h3>Libro de Clases</h3>
            </div>
            <div className="tabla-container">
                <table className="tabla-alumnos">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre Apellido</th>
                            <th>N1</th>
                            <th>N2</th>
                            <th>N3</th>
                            <th>N4</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map((alumno) => (
                            <tr key={alumno.rut}>
                                <td>{alumno.rut}</td>
                                <td>{alumno.nombre} {alumno.apellido}</td>
                                <td>{alumno.n1}</td>
                                <td>{alumno.n2}</td>
                                <td>{alumno.n3}</td>
                                <td>{alumno.n4}</td>
                                <td>{alumno.promedio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerCurso;
