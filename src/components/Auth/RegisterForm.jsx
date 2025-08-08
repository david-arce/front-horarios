import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
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

      {message && <p className="error">{message}</p>}

      <div className="button-group">
        <button type="submit">Registrarse</button>
      </div>
    </form>
  );
}
