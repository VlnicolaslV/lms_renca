import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

import VerCursos from './VerCursos';
import VerCurso from './VerCurso';
import VerForos from './VerForos';
import TomarAsistencias from './TomarAsistencias';
import VerAsistencias from './VerAsistencias';
import VerTareas from './VerTareas';
import CrearTarea from './CrearTarea';
import VerRecursos from './VerRecursos';
import CrearRecurso from './CrearRecurso';
import CrearForo from './CrearForo';
import VerResultados from './VerResultados';
import './profesorCss/profesor.css';

const ProfesorDashboard = () => {
    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [subSelectedOption, setSubSelectedOption] = useState('');
    const [subSubSelectedOption, setSubSubSelectedOption] = useState('');
    const [currentCursoAsignaturaId, setCurrentCursoAsignaturaId] = useState(null);
    const [currentCursoId, setCurrentCursoId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getUserData();
                setUser(userData);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        authService.cerrarSesion();
        navigate('/'); // Redirige al login
    }; 

    const handleMenuClick = (option) => {
        setSelectedOption(option);
        setSubSelectedOption('');
        setSubSubSelectedOption('');
    };

    const handleSubMenuClick = (subOption) => {
        setSubSelectedOption(subOption);
        setSubSubSelectedOption('');
    };

    const handleSubSubMenuClickAsignatura = (subSubOption, idCursoAsignatura = null) => {
        setSubSubSelectedOption(subSubOption);
        if (idCursoAsignatura) setCurrentCursoAsignaturaId(idCursoAsignatura);
    };

    const handleSubSubMenuClick = (subSubOption, idAsignatura = null) => {
        setSubSubSelectedOption(subSubOption);
        if (idAsignatura) setCurrentCursoId(idAsignatura);
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="dashboard-container-profesor">
            <div className="sidebar-profesor">
                <nav className="menu-profesor">
                    <ul>
                        <li>
                            <button onClick={() => handleMenuClick('cursos')}>Cursos</button>
                            {selectedOption === 'cursos' && (
                                <ul className="profesor-submenu">
                                    <li>
                                        <button onClick={() => handleSubMenuClick('verCursos')}>Ver Cursos</button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button onClick={() => handleMenuClick('resultados')}>Resultados</button>
                            {selectedOption === 'resultados' && (
                                <ul className="profesor-submenu">
                                    <li>
                                        <button onClick={() => handleSubMenuClick('verResultados')}>Ver Resultados</button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="main-content">
                <div className="header">
                    <h1>Bienvenido, {user.nombre}</h1>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
                <div className="profesor-content">
                    {subSelectedOption === 'verCursos' && !subSubSelectedOption && (
                        <VerCursos 
                            setSubSubSelectedOptionAsignatura={handleSubSubMenuClickAsignatura}
                            setSubSubSelectedOption={handleSubSubMenuClick} 
                        />
                    )}
                    {subSubSelectedOption === 'verCurso' && (
                        <VerCurso idAsignatura={currentCursoId} />
                    )}
                    {subSubSelectedOption === 'verTareas' && (
                        <VerTareas idCursoAsignatura={currentCursoAsignaturaId} setSubSubSelectedOption={handleSubSubMenuClickAsignatura} />
                    )}
                    {subSubSelectedOption === 'crearTarea' && (
                        <CrearTarea idCursoAsignatura={currentCursoAsignaturaId} />
                    )}
                    {subSubSelectedOption === 'verAsistencias' && (
                        <VerAsistencias idCursoAsignatura={currentCursoAsignaturaId} />
                    )}
                    {subSubSelectedOption === 'tomarAsistencias' && (
                        <TomarAsistencias idCursoAsignatura={currentCursoAsignaturaId} />
                    )}
                    {subSubSelectedOption === 'recursos' && (
                        <VerRecursos idCursoAsignatura={currentCursoAsignaturaId} setSubSubSelectedOption={handleSubSubMenuClickAsignatura} />
                    )}
                    {subSubSelectedOption === 'crearRecurso' && (
                        <CrearRecurso idCursoAsignatura={currentCursoAsignaturaId} />
                    )}
                    {subSubSelectedOption === 'verForos' && (
                        <VerForos idCursoAsignatura={currentCursoAsignaturaId} setSubSubSelectedOption={handleSubSubMenuClickAsignatura} />
                    )}
                    {subSubSelectedOption === 'crearForo' && (
                        <CrearForo idCursoAsignatura={currentCursoAsignaturaId} />
                    )}
                    {subSubSelectedOption === 'verResultados' && (
                        <VerResultados idCursoAsignatura={currentCursoAsignaturaId} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfesorDashboard;
