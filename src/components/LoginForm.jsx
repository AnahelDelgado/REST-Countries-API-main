import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica de autenticación real.
    login();
    navigate('/perfil');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input type="text" placeholder="Usuario" required />
      <input type="password" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default LoginForm;
