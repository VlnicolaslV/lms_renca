import React, { useEffect, useState } from 'react';
import './estudianteCss/asistencia.css'

const Asistencia = () => {
    const [asistencia, setAsistencia] = useState([]);

    

    if (!asistencia.length) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Asistencia</h2>
            <ul>
                {asistencia.map((registro, index) => (
                    <li key={index}>{registro.fecha}: {registro.estado}</li>
                ))}
            </ul>
        </div>
    );
};

export default Asistencia;
