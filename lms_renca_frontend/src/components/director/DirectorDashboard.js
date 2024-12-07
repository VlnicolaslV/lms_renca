import React, { useState, useEffect } from 'react';
import authService from '../../services/authService'; // Ajusta la ruta según tu estructura
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir

import CrearCursoForm from './CrearCursoForm';
import VerCursos from './VerCursos';
import CrearProfesorForm from './CrearProfesorForm';
import VerProfesores from './VerProfesores';
import CrearEstudianteForm from './CrearEstudianteForm';
import VerEstudiantes from './VerEstudiantes';
import CrearAsignaturaForm from './CrearAsignaturaForm';
import VerAsignaturas from './VerAsignaturas';
import Reportes from './Reportes';
import './directorCss/director.css';

function DirectorDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData(); // Función para obtener datos del usuario
        setUser(userData);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        // Manejar el error, por ejemplo, redirigiendo al login
      }
    };
    fetchUserData();
  }, []);

  const [selectedOption, setSelectedOption] = useState(''); // Guarda la opción seleccionada

  // Función para manejar la selección del menú
  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await authService.cerrarSesion(navigate('/'));
       // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, inténtelo de nuevo.");
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard-container-director">
      <div className="sidebar-director">
        <nav className="menu-director">
          <ul>
            <li>
              <button onClick={() => handleMenuClick('cursos')}>Cursos</button>
              {selectedOption === 'cursos' && (
                <ul className="director-submenu">
                  <li><button onClick={() => handleMenuClick('crearCurso')}>Crear Curso</button></li>
                  <li><button onClick={() => handleMenuClick('verCursos')}>Ver Cursos</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => handleMenuClick('asignaturas')}>Asignaturas</button>
              {selectedOption === 'asignaturas' && (
                <ul className="director-submenu">
                  <li><button onClick={() => handleMenuClick('crearAsignatura')}>Crear Asignatura</button></li>
                  <li><button onClick={() => handleMenuClick('verAsignaturas')}>Ver Asignaturas</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => handleMenuClick('profesores')}>Profesores</button>
              {selectedOption === 'profesores' && (
                <ul className="director-submenu">
                  <li><button onClick={() => handleMenuClick('crearProfesor')}>Crear Profesor</button></li>
                  <li><button onClick={() => handleMenuClick('verProfesores')}>Ver Profesores</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => handleMenuClick('estudiantes')}>Estudiantes</button>
              {selectedOption === 'estudiantes' && (
                <ul className="director-submenu">
                  <li><button onClick={() => handleMenuClick('crearEstudiante')}>Crear Estudiante</button></li>
                  <li><button onClick={() => handleMenuClick('verEstudiantes')}>Ver Estudiantes</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => handleMenuClick('reportes')}>Reportes</button>
              {selectedOption === 'reportes' && (
                <ul className="director-submenu">
                  <li><button onClick={() => handleMenuClick('verReportes')}>Ver Reportes</button></li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <div className='main-content'>
        <div className="header">
          <h2>Bienvenido, {user.nombre}</h2>
          <button onClick={handleLogout}>Cerrar Sesión</button> {/* Botón para cerrar sesión */}
        </div>     
        <div className="director-content">
          {selectedOption === 'crearCurso' && <CrearCursoForm />}
          {selectedOption === 'verCursos' && <VerCursos />}
          {selectedOption === 'crearProfesor' && <CrearProfesorForm />}
          {selectedOption === 'verProfesores' && <VerProfesores />}
          {selectedOption === 'crearEstudiante' && <CrearEstudianteForm />}
          {selectedOption === 'verEstudiantes' && <VerEstudiantes />}
          {selectedOption === 'crearAsignatura' && <CrearAsignaturaForm />}
          {selectedOption === 'verAsignaturas' && <VerAsignaturas />}
          {selectedOption === 'verReportes' && <Reportes />}
        </div>
      </div> 
    </div>
  );
}

export default DirectorDashboard;
