import React, { useState, useEffect } from 'react';
import AdministradorService from '../../services/administradorService';

function Reportes() {
    const [reporteColegio, setReporteColegio] = useState(null);
    const [reporteCurso, setReporteCurso] = useState(null);
    const [reporteAsignatura, setReporteAsignatura] = useState(null);
    const [reporteEstudiante, setReporteEstudiante] = useState(null);

    const obtenerReporteColegio = async () => {
        try {
            const response = await AdministradorService.obtenerResultadosPorColegio();
            setReporteColegio(response.data.imagen);
        } catch (error) {
            console.error("Error al obtener el reporte de colegio:", error);
            // Manejar el error
        }
    };

    const obtenerReporteCurso = async () => {
        try {
            const response = await AdministradorService.obtenerResultadosPorCurso();
            setReporteCurso(response.data.imagen);
        } catch (error) {
            console.error("Error al obtener el reporte de curso:", error);
            // Manejar el error
        }
    };

    const obtenerReporteAsignatura = async () => {
        try {
            const response = await AdministradorService.obtenerResultadosPorAsignatura();
            setReporteAsignatura(response.data.imagen);
        } catch (error) {
            console.error("Error al obtener el reporte de asignatura:", error);
            // Manejar el error
        }
    };

    const obtenerReporteEstudiante = async () => {
        try {
            const response = await AdministradorService.obtenerResultadosPorEstudiante();
            setReporteEstudiante(response.data.imagen);
        } catch (error) {
            console.error("Error al obtener el reporte de estudiante:", error);
            // Manejar el error
        }
    };

    return (
        <div>
            <button onClick={obtenerReporteColegio}>Obtener Reporte de Colegio</button>
            <button onClick={obtenerReporteCurso}>Obtener Reporte de Curso</button>
            <button onClick={obtenerReporteAsignatura}>Obtener Reporte de Asignatura</button>
            <button onClick={obtenerReporteEstudiante}>Obtener Reporte de Estudiante</button>

            {reporteColegio && (
                <img src={`data:image/png;base64,${reporteColegio}`} alt="Reporte de Colegio" />
            )}

            {reporteCurso && (
                <img src={`data:image/png;base64,${reporteCurso}`} alt="Reporte de Curso" />
            )}

            {reporteAsignatura && (
                <img src={`data:image/png;base64,${reporteAsignatura}`} alt="Reporte de Asignatura" />
            )}

            {reporteEstudiante && (
                <img src={`data:image/png;base64,${reporteEstudiante}`} alt="Reporte de Estudiante" />
            )}
        </div>
    );
}

export default Reportes;