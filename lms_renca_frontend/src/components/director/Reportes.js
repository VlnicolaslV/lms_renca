import React, { useState } from 'react';
import directorService from '../../services/directorService';

function Reportes() {
  const [reporteAsistencia, setReporteAsistencia] = useState(null);
  const [reporteCalificaciones, setReporteCalificaciones] = useState(null);

  const obtenerReporteAsistencia = async () => {
    try {
      const response = await directorService.obtenerReporteAsistencia();
      setReporteAsistencia(response.data.imagen);
    } catch (error) {
      console.error("Error al obtener el reporte de asistencia:", error);
      // Manejar el error
    }
  };

  const obtenerReporteCalificaciones = async () => {
    try {
      const response = await directorService.obtenerReporteCalificaciones();
      setReporteCalificaciones(response.data.imagen);
    } catch (error) {
      console.error("Error al obtener el reporte de calificaciones:", error);
      // Manejar el error
    }
  };

  return (
    <div>
      <button onClick={obtenerReporteAsistencia}>Obtener Reporte de Asistencia</button>
      <button onClick={obtenerReporteCalificaciones}>Obtener Reporte de Calificaciones</button>

      {reporteAsistencia && (
        <img src={`data:image/png;base64,${reporteAsistencia}`} alt="Reporte de Asistencia" />
      )}

      {reporteCalificaciones && (
        <img src={`data:image/png;base64,${reporteCalificaciones}`} alt="Reporte de Calificaciones" />
      )}
    </div>
  );
}

export default Reportes;