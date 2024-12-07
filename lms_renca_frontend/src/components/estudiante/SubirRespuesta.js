import React, { useState } from 'react';
import estudianteService from '../../services/estudianteService';
import './estudianteCss/subirRespuesta.css';

const SubirRespuesta = ({ tareaId, estudianteRut, onResponseSubmitted }) => {
    const [archivo, setArchivo] = useState(null);
    const [comentario, setComentario] = useState('');

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const handleComentarioChange = (e) => {
        setComentario(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('tarea', tareaId);
        formData.append('estudiante', estudianteRut);
        formData.append('archivo_respuesta', archivo);
        formData.append('comentario', comentario);

        try {
            await estudianteService.subir_respuesta(formData);
            alert('Respuesta subida con éxito.');
            onResponseSubmitted();  // Llama a la función para actualizar la vista de tareas
        } catch (error) {
            console.error('Error al subir la respuesta:', error);
            alert('Hubo un error al subir la respuesta. Inténtalo de nuevo.');
        }
    };

    return (
        <form className="subir-respuesta-form" onSubmit={handleSubmit}>
            <h3>Subir Respuesta</h3>
            <input type="file" onChange={handleArchivoChange} required />
            <textarea
                value={comentario}
                onChange={handleComentarioChange}
                placeholder="Añadir un comentario (opcional)"
            ></textarea>
            <button type="submit">Subir</button>
        </form>
    );
};

export default SubirRespuesta;
