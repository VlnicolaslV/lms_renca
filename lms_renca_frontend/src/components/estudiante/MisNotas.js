import React, { useEffect, useState } from 'react';
import './estudianteCss/misNotas.css';

const MisNotas = () => {
    const [notas, setNotas] = useState([]);

    

    if (!notas.length) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Mis Notas</h2>
            <ul>
                {notas.map((nota, index) => (
                    <li key={index}>{nota.asignatura}: {nota.calificacion}</li>
                ))}
            </ul>
        </div>
    );
};

export default MisNotas;

