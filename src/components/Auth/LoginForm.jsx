// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';

export default function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch {
      setMessage('Usuario o contraseña incorrectos');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>

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
        <button type="submit">Login</button>
        <Link to="/register">
          <button type="button" className="register-btn">
            Registrarse
          </button>
        </Link>
      </div>
    </form>
  );
}
