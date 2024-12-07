import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profesorService from "../../services/profesorService";

function CrearTarea({ idCursoAsignatura }) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaPublicacion, setFechaPublicacion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [archivo, setArchivo] = useState(null);

    const handleFileChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('fecha_publicacion', fechaPublicacion);
        formData.append('fecha_entrega', fechaEntrega);
        if (archivo) {
            formData.append('archivo', archivo);
        }

        try {
            await profesorService.crearTarea(idCursoAsignatura, formData);
            // Limpiar los campos
            setTitulo("");
            setDescripcion("");
            setFechaPublicacion("");
            setFechaEntrega("");
            setArchivo(null);

            // Mostrar mensaje de éxito
            toast.success('¡Tarea creada exitosamente!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error al crear la tarea:", error);

            // Mostrar mensaje de error
            toast.error('Error al crear la tarea. Inténtalo nuevamente.', {
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
                <div>
                    <label htmlFor="titulo">Título:</label>
                    <input
                        type="text"
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fechaPublicacion">Fecha de Publicación:</label>
                    <input
                        type="date"
                        id="fechaPublicacion"
                        value={fechaPublicacion}
                        onChange={(e) => setFechaPublicacion(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
                    <input
                        type="date"
                        id="fechaEntrega"
                        value={fechaEntrega}
                        onChange={(e) => setFechaEntrega(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="archivo">Archivo:</label>
                    <input
                        type="file"
                        id="archivo"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Crear Tarea</button>
            </form>
            <ToastContainer />
        </>
    );
}

export default CrearTarea;
