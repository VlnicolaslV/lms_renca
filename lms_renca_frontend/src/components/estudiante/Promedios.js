import React, { useEffect, useState } from 'react';
import './estudianteCss/promedios.css';

const Promedios = () => {
    const [promedios, setPromedios] = useState([]);

    

    if (!promedios.length) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Promedios</h2>
            <ul>
                {promedios.map((promedio, index) => (
                    <li key={index}>{promedio.asignatura}: {promedio.promedio}</li>
                ))}
            </ul>
        </div>
    );
};

export default Promedios;
