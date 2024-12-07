import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profesorService from '../../services/profesorService';

const CrearForo = ({ idCursoAsignatura }) => {
    const [titulo, setTitulo] = useState('');
    const [tema, setTema] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                titulo,
                tema,
                fecha_creacion: fechaCreacion
            };

            await profesorService.crearForo(idCursoAsignatura, formData);
            toast.success('¡Foro creado exitosamente!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTitulo('');
            setTema('');
            setFechaCreacion('');
            navigate(`/profesor/`);
        } catch (error) {
            console.error('Error al crear el foro:', error);
            toast.error('Error al crear el foro. Intenta nuevamente.', {
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
            <h2>Crear Foro</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Título:
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </label>
                <label>
                    Tema:
                    <textarea value={tema} onChange={(e) => setTema(e.target.value)} required></textarea>
                </label>
                <label>
                    Fecha de Creación:
                    <input type="date" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)} required />
                </label>
                <button type="submit">Crear Foro</button>
            </form>
        </div>
    );
};

export default CrearForo;
