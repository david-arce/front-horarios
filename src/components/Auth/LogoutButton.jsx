import React, { useEffect, useState } from 'react';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('user'));

  useEffect(() => {
    const update = () => setIsAuth(!!localStorage.getItem('user'));
    window.addEventListener('storage', update);        // cambios en otras pestañas
    window.addEventListener('auth:changed', update);   // cambios en esta pestaña
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('auth:changed', update);
    };
  }, []);

  const handleLogout = () => {
    logout();
    // setIsAuth(false); // opcional, el evento ya actualiza el estado
    navigate('/login');
  };

  if (!isAuth) return null; // ⟵ oculto si no hay sesión

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
