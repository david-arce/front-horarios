import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '', user_type: ''});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password, form.user_type);
      setMessage('¡Registro exitoso! Redirigiendo al login…');
      navigate('/login');
    } catch (err) {
      const detail = err.response?.data?.detail;
      let errorMsg = 'Registro fallido';
      if (Array.isArray(detail)) {
        errorMsg = detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join(', ');
      } else if (typeof detail === 'string') {
        errorMsg = detail;
      }
      setMessage(errorMsg);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Registro</h2>

      <div className="form-group">
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          name="username"
          placeholder="Nombre de usuario"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="user_type">Tipo de usuario</label>
        <select id="user_type" name="user_type" onChange={handleChange}>
          <option value="">Seleccione un tipo</option>
          <option value="docente">docente</option>
          <option value="admin">admin</option>
        </select>
      </div>

      {message && <p className="error">{message}</p>}

      <div className="button-group">
        <button type="submit">Registrarse</button>
      </div>
    </form>
  );
}
