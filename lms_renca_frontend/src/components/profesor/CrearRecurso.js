import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profesorService from '../../services/profesorService';

const CrearRecurso = ({ idCursoAsignatura }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [archivo, setArchivo] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('fecha_creacion', fechaCreacion);
            formData.append('archivo', archivo);

            await profesorService.subirRecurso(idCursoAsignatura, formData);
            toast.success('¡Recurso subido exitosamente!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setNombre('');
            setDescripcion('');
            setFechaCreacion('');
            setArchivo(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            navigate(`/profesor/`);
        } catch (error) {
            console.error('Error al subir el recurso:', error);
            toast.error('Error al subir el recurso. Intenta nuevamente.', {
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
        <div>
            <ToastContainer />
            <h2>Crear Recurso</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </label>
                <label>
                    Descripción:
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                </label>
                <label>
                    Fecha de Creación:
                    <input type="date" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)} required />
                </label>
                <label>
                    Archivo:
                    <input type="file" ref={fileInputRef} onChange={(e) => setArchivo(e.target.files[0])} />
                </label>
                <button type="submit">Crear Recurso</button>
            </form>
        </div>
    );
};

export default CrearRecurso;
