import React, { useEffect, useState } from 'react';
import { EstudianteService } from '../../services/estudianteService';
import './estudianteCss/verForo.css';

const VerForo = ({ asignaturaId }) => {
    const [foros, setForos] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [fechaCreacionComentario, setFechaCreacionComentario] = useState('');
    const [selectedForoId, setSelectedForoId] = useState(null);

    useEffect(() => {
        const fetchForos = async () => {
            try {
                const response = await EstudianteService.obtener_foros(asignaturaId);
                setForos(response);
            } catch (error) {
                console.error("Error al obtener los foros:", error);
            }
        };
        fetchForos();
    }, [asignaturaId]);

    const fetchComentarios = async (foroId) => {
        try {
            const response = await EstudianteService.obtener_comentarios(foroId);
            setComentarios((prev) => ({ ...prev, [foroId]: response }));
        } catch (error) {
            console.error("Error al obtener los comentarios:", error);
        }
    };

    const handleForoClick = (foroId) => {
        if (!comentarios[foroId]) {
            fetchComentarios(foroId);
        }
        setSelectedForoId(foroId);
    };

    const handleComentar = async (idForo) => {
        if (!nuevoComentario || !fechaCreacionComentario) return;

        try {
            await EstudianteService.comentar_foro(idForo, nuevoComentario, fechaCreacionComentario);
            setNuevoComentario('');
            setFechaCreacionComentario('');
            fetchComentarios(idForo);
        } catch (error) {
            console.error("Error al comentar en el foro:", error);
        }
    };

    return (
        <div className="ver-foro-container">
            <h2>Foros de la Asignatura</h2>
            {foros.map((foro, index) => (
                <div key={index} className="foro-card" onClick={() => handleForoClick(foro.id)}>
                    <h3>{foro.titulo}</h3>
                    <p>{foro.tema}</p>
                    <p>Creado en: {new Date(foro.fecha_creacion).toLocaleDateString()}</p>
                    {selectedForoId === foro.id && (
                        <>
                            <div className="comentarios-container">
                                <h3>Comentarios</h3>
                                {comentarios[foro.id] && comentarios[foro.id].map((comentario, index) => (
                                    <div key={index} className="comentario-card">
                                        <p>{comentario.comentario}</p>
                                        <p>Autor: {comentario.usuario_nombre} {comentario.usuario_apellido}</p>
                                        <p>Fecha: {new Date(comentario.fecha_creacion).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleComentar(foro.id); }}>
                                <div className="form-group">
                                    <label htmlFor="nuevoComentario">Nuevo Comentario</label>
                                    <textarea
                                        id="nuevoComentario"
                                        value={nuevoComentario}
                                        onChange={(e) => setNuevoComentario(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fechaCreacionComentario">Fecha de Creación del Comentario</label>
                                    <input
                                        type="date"
                                        id="fechaCreacionComentario"
                                        value={fechaCreacionComentario}
                                        onChange={(e) => setFechaCreacionComentario(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit">Comentar</button>
                            </form>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VerForo;
