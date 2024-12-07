import React, { useState, useEffect } from 'react';
import AdministradorService from '../../services/administradorService';
import './municipalidad/verDirectores.css'; // Importar el archivo CSS para estilos

function VerDirectores() {
    const [directores, setDirectores] = useState([]);

    useEffect(() => {
        const fetchDirectores = async () => {
            try {
                const directoresData = await AdministradorService.obtenerDirectores();
                setDirectores(directoresData.directores);
            } catch (error) {
                console.error("Error al obtener los directores:", error);
            }
        };
        fetchDirectores();
    }, []);

    const handleDelete = async (rut) => {
        try {
            await AdministradorService.eliminarDirector(rut);
            setDirectores(directores.filter((director) => director.rut !== rut));
            alert("Director eliminado con éxito.");
        } catch (error) {
            console.error("Error al eliminar el director:", error);
            alert("Error al eliminar el director.");
        }
    };

    const handleEdit = (rut) => {
        alert(`Modificar director con RUT: ${rut}`);
    };

    return (
        <div className="Directores-container">
            <h2>Directores</h2>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {directores.map((director) => (
                        <tr key={director.rut}>
                            <td>{director.rut}</td>
                            <td>{director.nombre}</td>
                            <td>{director.apellido}</td>
                            <td>{director.direccion}</td>
                            <td>{director.telefono}</td>
                            <td>{director.correo}</td>
                            <td>{director.fecha_nacimiento}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(director.rut)}>Modificar</button>
                                
                            </td>
                            <td>
                            <button className="delete-button" onClick={() => handleDelete(director.rut)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VerDirectores;
