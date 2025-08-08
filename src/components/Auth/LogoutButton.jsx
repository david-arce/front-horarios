import React from 'react';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // Limpia el token del localStorage
    navigate('/login'); // Redirige al login
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
