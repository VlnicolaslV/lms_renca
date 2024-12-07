import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService'; 
import './municipalidad/administrador.css';
import CrearColegioForm from './CrearColegio';
import VerColegios from './VerColegios';
import CrearDirector from './CrearDirector';
import VerDirectores from './VerDirectores';
import Reportes from '../director/Reportes';

function AdministradorDashboard() {
  const [user, setUser] = useState(null);
  
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
    
    const [selectedOption, setSelectedOption] = useState(''); 

    const handleMenuClick = (option) => {
        setSelectedOption(option);
    };

    if (!user) {
      return <div>Cargando...</div>;
    }
 
    return (
        <div className="dashboard-container-administrador">
            <div className="sidebar-administrador">
                <nav className="menu-administrador">
                    <ul>
                        <li>
                            <button onClick={() => handleMenuClick('colegios')}>Colegios</button>
                            {selectedOption === 'colegios' && (
                                <ul className="administrador-submenu">
                                    <li><button onClick={() => handleMenuClick('crearColegio')}>Crear Colegio</button></li>
                                    <li><button onClick={() => handleMenuClick('verColegios')}>Ver Colegios</button></li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button onClick={() => handleMenuClick('directores')}>Directores</button>
                            {selectedOption === 'directores' && (
                                <ul className="administrador-submenu">
                                    <li><button onClick={() => handleMenuClick('crearDirector')}>Crear Director</button></li>
                                    <li><button onClick={() => handleMenuClick('verDirectores')}>Ver Directores</button></li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button onClick={() => handleMenuClick('reportes')}>Reportes</button>
                            {selectedOption === 'reportes' && (
                                <ul className="administrador-submenu">
                                    <li><button onClick={() => handleMenuClick('reportesAsistencias')}>Reportes de Asistencias</button></li>
                                    <li><button onClick={() => handleMenuClick('reportesCalificaciones')}>Reportes de Calificaciones</button></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                <div className="header">
                    <h2>Bienvenido, {user.nombre}</h2>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>     
                <div className="administrador-content">
                    {selectedOption === 'crearColegio' && <CrearColegioForm />}
                    {selectedOption === 'verColegios' && <VerColegios />}
                    {selectedOption === 'crearDirector' && <CrearDirector />}
                    {selectedOption === 'verDirectores' && <VerDirectores />}
                    {selectedOption === 'reportes' && <Reportes />}
                </div>
            </div>
        </div>
    );
}

export default AdministradorDashboard;
