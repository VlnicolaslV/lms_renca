import React, { useState, useEffect } from 'react';
import profesorService from '../../services/profesorService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './profesorCss/verAsistencia.css';

const VerAsistencias = ({ idCursoAsignatura }) => {
    const [alumnos, setAlumnos] = useState([]);
    const [asignaturaNombre, setAsignaturaNombre] = useState("");
    const [cursoNombre, setCursoNombre] = useState("");
    const [cursoGrado, setCursoGrado] = useState("");
    const [fecha, setFecha] = useState('');
    const [presencias, setPresencias] = useState({});

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const cursoData = await profesorService.obtenerCursoAsignatura(idCursoAsignatura);
                if (cursoData) {
                    setAsignaturaNombre(cursoData.asignatura_nombre || 'Sin nombre');
                    setCursoNombre(cursoData.curso_nombre || 'Sin nombre');
                    setCursoGrado(cursoData.curso_grado || 'Sin grado');
                    const inscripcionesData = await profesorService.obtenerEstudiantes(cursoData.id);
                    setAlumnos(inscripcionesData.map(estudiante => ({
                        id: estudiante.id,
                        rut: estudiante.estudiante_rut,
                        nombre: estudiante.estudiante_nombre,
                        apellido: estudiante.estudiante_apellido,
                    })));
                }
            } catch (error) {
                console.error("Error al obtener el curso y alumnos:", error);
            }
        };
        fetchCurso();
    }, [idCursoAsignatura]);

    const handleFechaChange = (e) => {
        setFecha(e.target.value);
        console.log(`Fecha seleccionada: ${e.target.value}`);
    };

    const handlePresenciaChange = (idEstudiante) => {
        setPresencias(prevState => ({
            ...prevState,
            [idEstudiante]: !prevState[idEstudiante],
        }));
        console.log(`Cambiar presencia para estudiante ID ${idEstudiante}: ${!presencias[idEstudiante]}`);
    };

    const crearAsistencia = async () => {
        try {
            for (const idEstudiante in presencias) {
                if (presencias.hasOwnProperty(idEstudiante)) {
                    const alumno = alumnos.find(alumno => alumno.id === parseInt(idEstudiante));
                    if (alumno) {
                        console.log(`Enviando asistencia para ${alumno.rut}: ${presencias[idEstudiante]}`);
                        await profesorService.tomarAsistencia(
                            idCursoAsignatura,
                            alumno.rut,
                            { fecha, presente: presencias[idEstudiante] }
                        );
                    }
                }
            }
            toast.success('¡Asistencia creada exitosamente!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error('Error al crear la asistencia. Intenta nuevamente.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error("Error al crear las asistencias:", error);
        }
    };

    return (
        <div className="curso-detalle-container">
            <div className="header">
                <h2>{asignaturaNombre} {cursoNombre} - {cursoGrado}</h2>
                <h3>Libro de Asistencias</h3>
            </div>
            <div className="tabla-container">
                <div>
                    <label>Fecha: </label>
                    <input type="date" value={fecha} onChange={handleFechaChange} />
                </div>
                <table className="tabla-alumnos">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre Apellido</th>
                            <th>Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map((alumno) => (
                            <tr key={alumno.id}>
                                <td>{alumno.rut}</td>
                                <td>{alumno.nombre} {alumno.apellido}</td>
                                <td>
                                    <button
                                        style={{ backgroundColor: presencias[alumno.id] ? 'green' : 'red' }}
                                        onClick={() => handlePresenciaChange(alumno.id)}
                                    >
                                        {presencias[alumno.id] ? 'Presente' : 'Ausente'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="button-create" onClick={crearAsistencia}>Crear Asistencia</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VerAsistencias;
