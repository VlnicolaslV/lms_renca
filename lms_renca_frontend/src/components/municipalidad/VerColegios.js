import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdministradorService from '../../services/administradorService';
import './municipalidad/verColegios.css'; // Importar el archivo CSS para estilos

function VerColegios() {
    const [colegios, setColegios] = useState([]);

    useEffect(() => {
        const fetchColegios = async () => {
            try {
                const colegiosData = await AdministradorService.obtenerColegios();
                setColegios(colegiosData);
            } catch (error) {
                console.error("Error al obtener los colegios:", error);
                toast.error('Error al obtener los colegios. Inténtalo nuevamente.', {
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
        fetchColegios();
    }, []);

    const handleDelete = async (id) => {
        try {
            await AdministradorService.eliminarColegio(id);
            setColegios(colegios.filter((colegio) => colegio.id !== id));
            toast.success('Colegio eliminado con éxito.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error al eliminar el colegio:", error);
            toast.error('Error al eliminar el colegio. Inténtalo nuevamente.', {
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

    const handleEdit = (id) => {
        alert(`Modificar colegio con ID: ${id}`);
    };

    return (
        <div className="Colegios-container">
            <h2>Colegios</h2>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {colegios.map((colegio) => (
                        <tr key={colegio.id}>
                            <td>{colegio.id}</td>
                            <td>{colegio.nombre}</td>
                            <td>{colegio.direccion}</td>
                            <td>{colegio.telefono}</td>
                            <td>{colegio.correo}</td>
                            <td><button className="edit-button" onClick={() => handleEdit(colegio.id)}>Editar</button></td>
                            <td><button className="delete-button" onClick={() => handleDelete(colegio.id)}>Eliminar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
}

export default VerColegios;

