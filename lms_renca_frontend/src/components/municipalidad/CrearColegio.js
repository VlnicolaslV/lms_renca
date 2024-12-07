import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdministradorService from '../../services/administradorService';

function CrearColegio() {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [directorRut, setDirectorRut] = useState('');
    const [directores, setDirectores] = useState([]);
    const [municipalidadId, setMunicipalidadId] = useState('');
    const [municipalidades, setMunicipalidades] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Cargar municipalidades y directores disponibles
    useEffect(() => {
        const fetchMunicipalidades = async () => {
            try {
                const response = await AdministradorService.obtenerMunicipalidades();
                setMunicipalidades(response);
            } catch (error) {
                console.error("Error al obtener las municipalidades:", error);
                setErrorMessage("No se pudieron cargar las municipalidades.");
            }
        };
        fetchMunicipalidades();
    }, []);

    useEffect(() => {
        const fetchDirectores = async () => {
            try {
                const response = await AdministradorService.obtenerDirectoresSinColegio();
                setDirectores(response);
            } catch (error) {
                console.error("Error al obtener los directores:", error);
                setErrorMessage("No se pudieron cargar los directores.");
            }
        };
        fetchDirectores();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await AdministradorService.crearColegio({
                nombre,
                direccion,
                telefono,
                directorRut,
                municipalidadId
            });
            
            setNombre('');
            setDireccion('');
            setTelefono('');
            setDirectorRut('');
            setMunicipalidadId('');
            toast.success('¡Colegio creado con éxito!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error al crear el colegio:", error);
            toast.error('Error al crear el colegio. Inténtalo nuevamente.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    

    return (
        <>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="direccion">Dirección:</label>
                    <input
                        type="text"
                        id="direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="text"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="director">Director:</label>
                    <select
                        id="director"
                        value={directorRut}
                        onChange={(e) => setDirectorRut(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un director</option>
                        {directores.map((director) => (
                            <option key={director.rut} value={director.rut}>
                                {director.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="municipalidad">Municipalidad:</label>
                    <select
                        id="municipalidad"
                        value={municipalidadId}
                        onChange={(e) => setMunicipalidadId(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una municipalidad</option>
                        {municipalidades.map((municipalidad) => (
                            <option key={municipalidad.id} value={municipalidad.id}>
                                {municipalidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Crear Colegio</button>
            </form>
            <ToastContainer />
        </>
    );
}

export default CrearColegio;
