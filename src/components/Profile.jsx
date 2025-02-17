import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const Profile = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <p>No estás autenticado.</p>;
  }

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p>Bienvenido a tu perfil.</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Profile;
