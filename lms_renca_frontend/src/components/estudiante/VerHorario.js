import React, { useEffect, useState } from 'react';
import './estudianteCss/verHorario.css';

const VerHorario = () => {
    const [horario, setHorario] = useState([]);

    

    //if (!horario.length) {
    //    return <div>Cargando...</div>;
    //}

    return (
        <div>
            <h2>Horario</h2>
            <ul>
                {horario.map((clase, index) => (
                    <li key={index}>{clase.dia}: {clase.hora} - {clase.asignatura}</li>
                ))}
            </ul>
        </div>
    );
};

export default VerHorario;
