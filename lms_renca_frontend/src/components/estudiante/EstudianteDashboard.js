import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import authService from "../../services/authService";
import VerCurso from "./VerCurso";
import VerAsignaturas from "./VerAsignaturas";
import VerHorario from "./VerHorario";
import MisNotas from "./MisNotas";
import Asistencia from "./Asistencia";
import Promedios from "./Promedios";
import VerTareas from "./VerTareas";
import SubirRespuesta from "./SubirRespuesta";
import './estudianteCss/estudiante.css';

const EstudianteDashboard = () => {
    const [user, setUser] = useState(null);
    const [selectedView, setSelectedView] = useState("verCurso");
    const [selectedAsignaturaId, setSelectedAsignaturaId] = useState(null);
    const [selectedTareaId, setSelectedTareaId] = useState(null);
    const [showResponseForm, setShowResponseForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getUserData();
                if (!userData.rut) {
                    throw new Error("El rut del usuario no está definido.");
                }
                setUser(userData);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleButtonClick = (view, asignaturaId = null) => {
        setSelectedView(view);
        setSelectedAsignaturaId(asignaturaId);
    };

    const handleResponderTareaClick = (tareaId) => {
        setSelectedTareaId(tareaId);
        setShowResponseForm(true);
    };

    const handleResponseSubmitted = () => {
        setShowResponseForm(false);
        setSelectedTareaId(null);
        setSelectedView("tareas");
    };

    const handleLogout = () => {
        authService.cerrarSesion();
        navigate('/'); // Redirige al login
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>LMS Renca</h1>
                <div>
                    {user && (
                        <div>
                            <span>{user.nombre} {user.apellido}</span>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </div>
            <nav className="nav-bar">
                <ul>
                    <li>
                        <button onClick={() => setSelectedView("verCurso")}>Mi Curso</button>
                    </li>
                    <li>
                        <button onClick={() => setSelectedView("notas")}>Mis Notas</button>
                    </li>
                    <li>
                        <button onClick={() => setSelectedView("resultados")}>Mis Resultados</button>
                        {selectedView === "resultados" && (
                            <ul className="submenu">
                                <li><button onClick={() => setSelectedView("asistencia")}>Asistencia</button></li>
                                <li><button onClick={() => setSelectedView("promedios")}>Promedios</button></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
            <div className="content">
                {selectedView === "verCurso" && <VerCurso onButtonClick={handleButtonClick} />}
                {selectedView === "asignaturas" && (
                    <VerAsignaturas
                        onButtonClick={handleButtonClick}
                        estudianteRut={user.rut}
                        onResponderTareaClick={handleResponderTareaClick}
                    />
                )}
                {selectedView === "horario" && <VerHorario />}
                {selectedView === "notas" && <MisNotas />}
                {selectedView === "asistencia" && <Asistencia />}
                {selectedView === "promedios" && <Promedios />}
                {selectedView === "tareas" && (
                    <VerTareas
                        asignaturaId={selectedAsignaturaId}
                        estudianteRut={user.rut}
                        onResponderTareaClick={handleResponderTareaClick} // Integrando de nuevo
                    />
                )}
                {showResponseForm && selectedTareaId && (
                    <SubirRespuesta
                        tareaId={selectedTareaId}
                        onResponseSubmitted={handleResponseSubmitted}
                    />
                )}
            </div>
        </div>
    );
};

export default EstudianteDashboard;
