// LMS/lms_renca_frontend/src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioServices";
import styles from './Login.module.css';


function Login() {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
  
    try {
      const response = await usuarioService.login(rut, password);
      console.log("Rol recibido:", response.rol);  // Añade este console.log
  
      // Guardar el token en el localStorage
      localStorage.setItem("token", response.access);
  
      // Redirigir al usuario según su rol
      switch (response.rol) {
        case "ADMINISTRADOR":
          navigate("/administrador");
          break;
        case "DIRECTOR":
          navigate("/director");
          break;
        case "ESTUDIANTE":
          navigate("/estudiante");
          break;
        case "PROFESOR":
          navigate("/profesor");
          break;
        default:
          setError("Rol de usuario no válido");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response && error.response.status === 401) {
        setError("Credenciales inválidas");
      } else {
        setError("Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  };
  

  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        <div>
          <label htmlFor="rut">Rut:</label>
          <input
            className={styles.input}
            type="text"
            rut="rut"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            className={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.btn}>Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
